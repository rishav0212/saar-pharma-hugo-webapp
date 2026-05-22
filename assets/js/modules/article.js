/**
 * ARTICLE MODULE
 * Handles runtime behaviours on article single pages:
 *
 *  1. Reading progress bar — fills as user scrolls through article prose
 *  2. TOC active state — highlights current section in the sidebar TOC
 *     using IntersectionObserver (no scroll listener needed, performant)
 *  3. Mobile TOC accordion — toggles the inline TOC above article content
 *  4. FAQ accordion — animated expand/collapse for the {{% faqs %}} shortcode
 *  5. Copy-link button — copies the article URL to clipboard with feedback
 *
 * All functions are no-ops if the relevant DOM elements are absent,
 * so this module is safely initialised on every page.
 */

export function initArticle() {
  initProgressBar();
  initTocActiveState();
  initMobileToc();
  initFaqAccordion();
  initCopyLink();
  initArticlesList();
}

/* ── Reading Progress Bar ─────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('article-progress');
  if (!bar) return;

  const prose = document.getElementById('article-prose');
  if (!prose) return;

  const updateBar = () => {
    const proseTop    = prose.offsetTop;
    const proseHeight = prose.offsetHeight;
    const scrollY     = window.scrollY;
    const viewH       = window.innerHeight;

    /* Progress runs from the prose start to near the end */
    const total    = proseHeight - viewH * 0.7;
    const current  = scrollY - proseTop + viewH * 0.15;
    const pct      = Math.min(100, Math.max(0, (current / total) * 100));

    bar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar(); /* initialise on load */
}

/* ── Sidebar TOC Active State (High-Performance Scroll-Spy) ──────── */
/*
 * Tracks the user's scroll position and highlights the corresponding section
 * in the sidebar Table of Contents.
 *
 * Optimization: Uses a requestAnimationFrame-throttled scroll listener with passive
 * events for absolute performance. This avoids layout thrashing while achieving
 * 100% pixel-perfect accuracy even inside relative grids or nested offset containers
 * (where simple IntersectionObserver margins and offsetTop fail).
 */
function initTocActiveState() {
  const headings = Array.from(document.querySelectorAll(
    '#article-prose h2, #article-prose h3, #article-prose h4'
  )).filter(h => h.id);
  if (!headings.length) return;

  // Select all TOC links (both mobile dropdown and desktop sidebar)
  const tocLinks = Array.from(document.querySelectorAll('.article-toc a'));
  if (!tocLinks.length) return;

  let lastActiveId = null; // Track last active ID to only scroll when it changes

  const updateActiveState = () => {
    const scrollY = window.scrollY;
    const triggerPoint = scrollY + 140; // 140px top offset accounts for sticky headers & comfort

    let activeId = null;

    // Check if the user has reached the bottom of the page
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50);
    if (isAtBottom) {
      activeId = headings[headings.length - 1].id;
    } else {
      // Find the last heading that has scrolled past the trigger point
      for (let i = 0; i < headings.length; i++) {
        const headingTop = headings[i].getBoundingClientRect().top + scrollY;
        if (headingTop <= triggerPoint) {
          activeId = headings[i].id;
        } else {
          break; // Stop loop since headings are in strict document order
        }
      }
    }

    // Update active class for all TOC links (mobile + desktop sidebar)
    if (activeId) {
      tocLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('is-active', isActive);
      });

      // Premium touch: Auto-scroll the sidebar TOC container to center the active heading
      if (activeId !== lastActiveId) {
        lastActiveId = activeId;
        const activeLink = document.querySelector(`.article-sidebar .article-toc a[href="#${activeId}"]`);
        const tocScrollContainer = document.querySelector('.sb-toc-scroll');
        if (activeLink && tocScrollContainer) {
          const containerRect = tocScrollContainer.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          const currentScroll = tocScrollContainer.scrollTop;
          
          // Calculate absolute relative position of the link within the scrollpane
          const relativeTop = linkRect.top - containerRect.top + currentScroll;
          // Calculate the target scroll top to position the active link exactly in the center
          const targetScroll = relativeTop - (containerRect.height / 2) + (linkRect.height / 2);
          
          tocScrollContainer.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      }
    } else {
      // If we are above the first heading, remove all active highlights
      tocLinks.forEach((link) => link.classList.remove('is-active'));
      lastActiveId = null;
    }
  };


  // Performant scroll & resize binding
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveState();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initialise active state on load
  updateActiveState();
}


/* ── Mobile TOC Accordion ────────────────────────────────────────── */
function initMobileToc() {
  const toggle = document.getElementById('toc-mobile-toggle');
  const body   = document.getElementById('toc-mobile-body');
  if (!toggle || !body) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded; /* flip: if was open → close, vice versa */
  });

  /* Close TOC when a link inside it is clicked (smooth scroll to section) */
  body.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      body.hidden = true;
    });
  });
}

/* ── FAQ Accordion ───────────────────────────────────────────────── */
/*
 * Uses aria-expanded pattern (not <details>) for better cross-browser
 * animation control and accessibility. Clicking a trigger opens its
 * panel and closes any other open panel (single-open behaviour).
 *
 * Animation: we remove `hidden` first (making panel visible but with
 * height 0), then on the next frame set the exact scrollHeight so the
 * CSS transition fires smoothly.
 */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('[data-faq-trigger]');
  if (!triggers.length) return;

  function openPanel(panel, trigger) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.style.maxHeight = '0px';
    
    /* force repaint */
    panel.offsetHeight;
    
    panel.style.maxHeight = panel.scrollHeight + 'px';

    const onTransitionEnd = (e) => {
      if (e.propertyName === 'max-height') {
        panel.style.maxHeight = '';
        panel.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    panel.addEventListener('transitionend', onTransitionEnd);
  }

  function closePanel(panel, trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    
    /* force repaint */
    panel.offsetHeight;
    
    panel.style.maxHeight = '0px';

    const onTransitionEnd = (e) => {
      if (e.propertyName === 'max-height') {
        panel.hidden = true;
        panel.style.maxHeight = '';
        panel.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    panel.addEventListener('transitionend', onTransitionEnd);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId    = trigger.getAttribute('aria-controls');
      const panel      = document.getElementById(panelId);
      if (!panel) return;

      if (isExpanded) {
        closePanel(panel, trigger);
      } else {
        /* Close any other open panel first */
        triggers.forEach((otherTrigger) => {
          if (otherTrigger === trigger) return;
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel   = document.getElementById(otherPanelId);
          if (otherPanel && !otherPanel.hidden) {
            closePanel(otherPanel, otherTrigger);
          }
        });

        /* Open this panel */
        openPanel(panel, trigger);
      }
    });
  });

  /* Open the first FAQ by default if there are FAQs */
  if (triggers.length > 0) {
    const firstTrigger = triggers[0];
    const firstPanelId = firstTrigger.getAttribute('aria-controls');
    const firstPanel   = document.getElementById(firstPanelId);
    if (firstPanel) {
      firstTrigger.setAttribute('aria-expanded', 'true');
      firstPanel.hidden = false;
    }
  }
}

/* ── Copy Link Button ────────────────────────────────────────────── */
/*
 * Copies the current page URL to clipboard.
 * Shows visual feedback ("Copied!") for 2 seconds, then resets.
 */
function initCopyLink() {
  const btn   = document.getElementById('sb-copy-link');
  const label = document.getElementById('sb-copy-label');
  if (!btn || !label) return;

  btn.addEventListener('click', async () => {
    const url = btn.getAttribute('data-url') || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      label.textContent = 'Copied!';
      btn.style.background = 'rgba(21, 159, 145, 0.15)';
      setTimeout(() => {
        label.textContent = 'Copy';
        btn.style.background = '';
      }, 2000);
    } catch {
      /* Fallback for older browsers */
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      label.textContent = 'Copied!';
      setTimeout(() => { label.textContent = 'Copy'; }, 2000);
    }
  });
}

/* ── Articles Directory Search & Dynamic Filters ─────────────────── */
/*
 * High-performance client-side search and category filtering system.
 * Filters articles instantly as users type in the search bar or click
 * category filter tabs, with smooth transition toggles and an interactive
 * empty state fallback.
 */
function initArticlesList() {
  const searchInput = document.getElementById('articles-search-input');
  const clearBtn    = document.getElementById('articles-search-clear');
  const filterPills = document.querySelectorAll('.articles-filters .filter-pill');
  const grid        = document.getElementById('articles-list-grid');
  const cards       = document.querySelectorAll('#articles-list-grid .editorial-card');
  const emptyState  = document.getElementById('articles-empty-state');
  const resetBtn    = document.getElementById('articles-reset-btn');
  
  if (!searchInput && !filterPills.length && !cards.length) return;

  let searchQuery = '';
  let activeFilter = 'all';

  const filterArticles = () => {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach((card) => {
      const title    = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';
      const tags     = card.getAttribute('data-tags') || '';
      const summary  = card.getAttribute('data-summary') || '';

      const matchesSearch = !query || 
                            title.includes(query) || 
                            category.includes(query) || 
                            tags.includes(query) || 
                            summary.includes(query);

      const matchesCategory = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('is-hidden');
      }
    });

    // Toggle empty state fallback smoothly
    if (emptyState) {
      emptyState.hidden = (visibleCount > 0);
    }
    
    // Toggle grid view display state (fade out briefly if needed)
    if (grid) {
      grid.style.opacity = (visibleCount > 0) ? '1' : '0';
    }
  };

  // Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.hidden = !searchQuery;
      }
      filterArticles();
    });
  }

  // Clear Button Event Listener (clears input and refocuses)
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.hidden = true;
      searchInput.focus();
      filterArticles();
    });
  }

  // Category Pills Event Listeners (exclusivity toggle)
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeFilter = (pill.getAttribute('data-filter') || 'all').toLowerCase();
      filterArticles();
    });
  });

  // Reset Button Event Listener (restores default list)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
      }
      if (clearBtn) {
        clearBtn.hidden = true;
      }
      filterPills.forEach((p) => {
        if (p.getAttribute('data-filter') === 'all') {
          p.classList.add('is-active');
        } else {
          p.classList.remove('is-active');
        }
      });
      activeFilter = 'all';
      filterArticles();
    });
  }
}
