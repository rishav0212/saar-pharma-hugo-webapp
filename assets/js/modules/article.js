/**
 * ARTICLE MODULE
 * Handles three runtime behaviours on article single pages:
 *
 *  1. Reading progress bar — fills as user scrolls through article prose
 *  2. TOC active state — highlights current section in the sidebar TOC
 *     using IntersectionObserver (no scroll listener needed, performant)
 *  3. Mobile TOC accordion — toggles the inline TOC above article content
 *
 * All functions are no-ops if the relevant DOM elements are absent,
 * so this module is safely initialised on every page.
 */

export function initArticle() {
  initProgressBar();
  initTocActiveState();
  initMobileToc();
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

  /* Track which heading is currently most visible.
     rootMargin: top offset (-15%) ensures the heading must be past
     the top 15% of the viewport before it becomes "active". */
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
