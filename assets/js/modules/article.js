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
  initHomepageArticlesCarousel();
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

  // Progressive Batch Pagination Elements
  const paginationContainer = document.getElementById('articles-pagination-container');
  const visibleCountEl      = document.getElementById('pagination-visible-count');
  const totalCountEl        = document.getElementById('pagination-total-count');
  const progressFillEl      = document.getElementById('pagination-progress-fill');
  const loadMoreBtn         = document.getElementById('articles-load-more-btn');
  
  if (!searchInput && !filterPills.length && !cards.length) return;

  const itemsPerPage = 6;
  let visibleLimit = itemsPerPage;
  let searchQuery = '';
  let activeFilter = 'all';

  const filterArticles = () => {
    let totalMatches = 0;
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
        totalMatches++;
        if (totalMatches <= visibleLimit) {
          card.style.display = '';
          card.classList.remove('is-hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('is-hidden');
        }
      } else {
        card.style.display = 'none';
        card.classList.add('is-hidden');
      }
    });

    // Toggle empty state fallback smoothly
    if (emptyState) {
      emptyState.hidden = (totalMatches > 0);
    }
    
    // Toggle grid view display state (fade out briefly if needed)
    if (grid) {
      grid.style.opacity = (totalMatches > 0) ? '1' : '0';
    }

    // Update smart progressive pagination details
    if (paginationContainer) {
      if (totalMatches > itemsPerPage) {
        paginationContainer.hidden = false;
        paginationContainer.style.display = 'flex';

        const displayedCount = Math.min(visibleLimit, totalMatches);
        if (visibleCountEl) visibleCountEl.textContent = displayedCount;
        if (totalCountEl) totalCountEl.textContent = totalMatches;
        
        if (progressFillEl) {
          const percentage = (displayedCount / totalMatches) * 100;
          progressFillEl.style.width = `${percentage}%`;
        }

        if (loadMoreBtn) {
          if (visibleLimit >= totalMatches) {
            loadMoreBtn.style.display = 'none';
          } else {
            loadMoreBtn.style.display = '';
          }
        }
      } else {
        paginationContainer.hidden = true;
        paginationContainer.style.display = 'none';
      }
    }
  };

  // Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.hidden = !searchQuery;
      }
      visibleLimit = itemsPerPage; // Reset page batch limit upon new searches
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
      visibleLimit = itemsPerPage; // Reset page batch limit
      filterArticles();
    });
  }

  // Category Pills Event Listeners (exclusivity toggle)
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeFilter = (pill.getAttribute('data-filter') || 'all').toLowerCase();
      visibleLimit = itemsPerPage; // Reset page batch limit upon new category filter
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
      visibleLimit = itemsPerPage; // Reset page batch limit
      filterArticles();
    });
  }

  // Load More Button Event Listener
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleLimit += itemsPerPage;
      filterArticles();
    });
  }

  // Initial execution to apply limits and setup pagination
  filterArticles();
}

/* ── B2B Insights Hub Dashboard Carousel ─────────────────────────── */
function initHomepageArticlesCarousel() {
  const hub = document.querySelector('.insights-hub');
  if (!hub) return;

  const spotlightDisplay = document.getElementById('spotlight-display');
  const spotlightCat = document.getElementById('spotlight-cat');
  const spotlightTimeVal = document.getElementById('spotlight-time-val');
  const spotlightTitle = document.getElementById('spotlight-title');
  const spotlightSummary = document.getElementById('spotlight-summary');
  const spotlightLink = document.getElementById('spotlight-link');
  const progressFill = document.getElementById('spotlight-progress-fill');
  const spotlightVisualContainer = document.getElementById('spotlight-visual-container');
  const spotlightTakeawayContainer = document.getElementById('spotlight-takeaway-container');
  const spotlightTakeaway = document.getElementById('spotlight-takeaway');

  const viewport = document.getElementById('insights-stream-viewport');
  const track = document.getElementById('insights-stream-track');
  
  if (!track || !viewport) return;
  
  const items = Array.from(track.querySelectorAll('.insights-stream__item'));
  const dots = Array.from(document.querySelectorAll('.insights-dot'));
  const prevBtn = document.getElementById('insights-prev');
  const nextBtn = document.getElementById('insights-next');
  
  if (!items.length) return;

  let currentIndex = 0;
  const totalItems = items.length;
  const rotationDuration = 6000; // 6 seconds auto-rotation timer
  let lastTime = 0;
  let accumulatedTime = 0;
  let isPaused = false;
  let rafId = null;

  // Viewport grab cursor styling
  viewport.style.cursor = 'grab';

  const scrollTrackTo = (index) => {
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track.scrollWidth;
    const item = items[index];
    if (!item) return;

    const itemWidth = item.offsetWidth;
    const itemOffsetLeft = item.offsetLeft;
    
    // Center active item
    let targetScroll = itemOffsetLeft - (viewportWidth / 2) + (itemWidth / 2);
    
    // Handle bounds
    const maxScroll = trackWidth - viewportWidth;
    if (targetScroll < 0) targetScroll = 0;
    if (targetScroll > maxScroll && maxScroll > 0) targetScroll = maxScroll;
    
    track.style.transform = `translate3d(${-targetScroll}px, 0, 0)`;
  };

  const updateSpotlight = (index) => {
    if (index === currentIndex) return;

    spotlightDisplay.classList.add('is-transitioning');
    
    items[currentIndex].classList.remove('is-active');
    dots[currentIndex]?.classList.remove('is-active');
    
    currentIndex = index;
    
    items[currentIndex].classList.add('is-active');
    dots[currentIndex]?.classList.add('is-active');

    const targetItem = items[currentIndex];
    const title = targetItem.getAttribute('data-title');
    const url = targetItem.getAttribute('data-url');
    const category = targetItem.getAttribute('data-category');
    const readTime = targetItem.getAttribute('data-read-time');
    const summary = targetItem.getAttribute('data-summary');
    const image = targetItem.getAttribute('data-image');
    const takeaway = targetItem.getAttribute('data-takeaway');

    setTimeout(() => {
      if (spotlightCat) spotlightCat.textContent = category;
      if (spotlightTimeVal) spotlightTimeVal.textContent = readTime;
      if (spotlightTitle) spotlightTitle.innerHTML = `<a href="${url}">${title}</a>`;
      if (spotlightSummary) spotlightSummary.innerHTML = summary;
      if (spotlightLink) {
        spotlightLink.setAttribute('href', url);
      }
      
      // Dynamic Spotlight Cover Image Swap
      if (spotlightVisualContainer) {
        if (image) {
          spotlightVisualContainer.innerHTML = `<img src="${image}" alt="${title}" class="insights-spotlight__img" id="spotlight-img">`;
        } else {
          spotlightVisualContainer.innerHTML = `
            <div class="insights-spotlight__placeholder" id="spotlight-placeholder">
              <i data-lucide="file-text" class="text-white/20" aria-hidden="true"></i>
            </div>`;
        }
      }

      // Dynamic Key Highlight Takeaway Swap
      if (spotlightTakeawayContainer && spotlightTakeaway) {
        if (takeaway && takeaway.trim() !== '') {
          spotlightTakeaway.innerHTML = takeaway;
        } else {
          spotlightTakeaway.innerHTML = 'Explore custom formulations, strict regulatory compliance, and WHO-GMP manufacturing excellence. Saar Biotech serves as a strategic third-party contract partner, streamlining your commercial pipelines.';
        }
        spotlightTakeawayContainer.style.display = '';
      }
      
      if (window.lucide) {
        window.lucide.createIcons();
      }

      spotlightDisplay.classList.remove('is-transitioning');
    }, 200);

    scrollTrackTo(currentIndex);
  };

  const selectIndex = (index) => {
    accumulatedTime = 0;
    if (progressFill) progressFill.style.width = '0%';
    updateSpotlight(index);
  };

  // RAF loop for smooth 60fps timer ticking
  const tick = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused) {
      accumulatedTime += elapsed;
      if (accumulatedTime >= rotationDuration) {
        accumulatedTime = 0;
        const nextIndex = (currentIndex + 1) % totalItems;
        updateSpotlight(nextIndex);
      }
      
      const percentage = (accumulatedTime / rotationDuration) * 100;
      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  // Start ticker loop
  rafId = requestAnimationFrame(tick);

  // Pause on hover
  hub.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  hub.addEventListener('mouseleave', () => {
    isPaused = false;
    lastTime = 0;
  });

  // Clicking cards
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      selectIndex(index);
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectIndex(index);
      }
    });
  });

  // Clicking dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      selectIndex(index);
    });
  });

  // Prev / Next button binds
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const target = (currentIndex - 1 + totalItems) % totalItems;
      selectIndex(target);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const target = (currentIndex + 1) % totalItems;
      selectIndex(target);
    });
  }

  // Window Resize adjustment
  window.addEventListener('resize', () => {
    scrollTrackTo(currentIndex);
  });

  // Center on load
  setTimeout(() => {
    scrollTrackTo(0);
  }, 100);

  // ── Drag & Swipe Mechanics (Mouse & Touch) ──
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTransform = 0;

  const parseTransformX = (el) => {
    try {
      const style = window.getComputedStyle(el);
      const transform = style.transform || style.webkitTransform;
      if (!transform || transform === 'none') return 0;
      const matrix = window.DOMMatrix ? new DOMMatrix(transform) : new WebKitCSSMatrix(transform);
      return matrix.m41 || matrix.e;
    } catch {
      return 0;
    }
  };

  // Touch triggers
  viewport.addEventListener('touchstart', (e) => {
    isPaused = true;
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
    startTransform = parseTransformX(track);
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translate3d(${startTransform + diff}px, 0, 0)`;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    
    const diff = currentX - startX;
    isPaused = false;
    lastTime = 0;
    
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        const nextIdx = (currentIndex + 1) % totalItems;
        selectIndex(nextIdx);
      } else {
        const prevIdx = (currentIndex - 1 + totalItems) % totalItems;
        selectIndex(prevIdx);
      }
    } else {
      scrollTrackTo(currentIndex);
    }
  });

  // Mouse triggers
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('a, button')) return; // let buttons/links handle their clicks normally
    if (e.button !== 0) return;
    isPaused = true;
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
    startTransform = parseTransformX(track);
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    track.style.transform = `translate3d(${startTransform + diff}px, 0, 0)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    viewport.style.cursor = 'grab';
    
    const diff = currentX - startX;
    isPaused = false;
    lastTime = 0;
    
    if (Math.abs(diff) > 60) {
      if (diff < 0) {
        const nextIdx = (currentIndex + 1) % totalItems;
        selectIndex(nextIdx);
      } else {
        const prevIdx = (currentIndex - 1 + totalItems) % totalItems;
        selectIndex(prevIdx);
      }
    } else {
      scrollTrackTo(currentIndex);
    }
  });
}
