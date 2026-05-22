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

/* ── Sidebar TOC Active State (IntersectionObserver) ─────────────── */
function initTocActiveState() {
  const toc = document.querySelector('.article-toc');
  if (!toc) return;

  const headings = document.querySelectorAll(
    '#article-prose h2, #article-prose h3, #article-prose h4'
  );
  if (!headings.length) return;

  const tocLinks = toc.querySelectorAll('a');
  if (!tocLinks.length) return;

  /*
   * Track which heading is currently most visible.
   * rootMargin: top offset (-15%) ensures the heading must be past
   * the top 15% of the viewport before it becomes "active".
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        tocLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', isActive);
        });
      });
    },
    {
      rootMargin: '-15% 0% -70% 0%',
      threshold: 0,
    }
  );

  headings.forEach((h) => {
    /* Hugo automatically adds IDs to headings when unsafe = true */
    if (h.id) observer.observe(h);
  });
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

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId    = trigger.getAttribute('aria-controls');
      const panel      = document.getElementById(panelId);
      if (!panel) return;

      if (isExpanded) {
        /* Close this panel */
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      } else {
        /* Close any other open panel first */
        triggers.forEach((otherTrigger) => {
          if (otherTrigger === trigger) return;
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel   = document.getElementById(otherPanelId);
          otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        });

        /* Open this panel */
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
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
