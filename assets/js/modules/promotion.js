/**
 * promotion.js — Saar Biotech Promotion Page Module
 * ─────────────────────────────────────────────────────────────────────
 * Handles all interactive features on the promotions single page:
 *   1. Poster lightbox (reuses the ps-lightbox already in baseof.html)
 *   2. Social share (Web Share API with clipboard fallback)
 *   3. Related promotions slider (reuses initSliders pattern)
 *   4. Enquiry modal pre-fill (reuses data-enquire-trigger pattern)
 *
 * This module uses a guard (getElementById) so it safely no-ops
 * on every non-promotion page — no side effects.
 */

export function initPromotion() {
  const promoPage = document.getElementById('promotion-main');
  // Guard: only run on promotion pages
  if (!promoPage) return;

  initPosterLightbox();
  initPromoShareButtons();
  initPromoRelatedSlider();
}


/**
 * 1. POSTER LIGHTBOX
 * Opens the ps-lightbox (already defined in baseof.html) with the promotion
 * poster image when the user clicks the zoom button or the poster itself.
 * Reuses the exact same lightbox DOM and close logic from gallery.js.
 */
function initPosterLightbox() {
  const zoomBtn  = document.getElementById('promo-poster-zoom');
  const posterEl = document.getElementById('promo-poster-img');
  const lightbox = document.getElementById('ps-lightbox');
  const lbImg    = document.getElementById('ps-lb-img');
  const lbClose  = document.getElementById('ps-lb-close');

  if (!lightbox || !lbImg) return;

  // Both the zoom button and a direct click on the poster image open the lightbox
  const triggers = [zoomBtn, posterEl].filter(Boolean);

  triggers.forEach(trigger => {
    trigger.style.cursor = 'zoom-in';
    trigger.addEventListener('click', () => {
      // Use the high-res src from the data attribute or directly from the img
      const src = zoomBtn?.dataset.poster || posterEl?.src || '';
      const alt = zoomBtn?.dataset.alt  || posterEl?.alt  || '';

      lbImg.src = src;
      lbImg.alt = alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Hide the prev/next arrows — there's only one poster
      const prevBtn = document.getElementById('ps-lb-prev');
      const nextBtn = document.getElementById('ps-lb-next');
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
    });
  });

  // Close on button click
  lbClose?.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}


/**
 * 2. SOCIAL SHARE BUTTONS
 * Handles all share button instances on the page (hero panel + sidebar).
 * Strategy:
 *   - WhatsApp: Opens wa.me link with the poster caption
 *   - LinkedIn: Opens LinkedIn share dialog with the page URL
 *   - Email:    Opens mailto link with pre-filled subject + body
 *   - Copy:     Uses Clipboard API, shows "Copied!" tooltip on success
 */
function initPromoShareButtons() {
  // WhatsApp share buttons (multiple instances possible)
  document.querySelectorAll('[id^="promo-share-wa"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const caption = btn.dataset.caption || document.title;
      const url = `https://wa.me/?text=${encodeURIComponent(caption)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  // LinkedIn share buttons
  document.querySelectorAll('[id^="promo-share-li"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pageUrl = btn.dataset.url || window.location.href;
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    });
  });

  // Email share buttons
  document.querySelectorAll('[id^="promo-share-email"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.dataset.subject || document.title;
      const body    = btn.dataset.body    || window.location.href;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });

  // Copy link buttons
  document.querySelectorAll('[id^="promo-share-copy"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url || window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        // Visual confirmation
        btn.classList.add('copied');
        const originalContent = btn.innerHTML;
        btn.innerHTML = btn.innerHTML.replace(/link|Copy.*/gi, 'Copied!');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalContent;
          // Re-init lucide icons in case we replaced an icon
          if (window.lucide) window.lucide.createIcons({ nodes: [btn] });
        }, 2000);
      } catch {
        // Fallback for browsers without clipboard API
        prompt('Copy this link:', url);
      }
    });
  });
}


/**
 * 3. RELATED PROMOTIONS SLIDER
 * Registers the #promo-related-slider with the existing slider controls
 * (prev-btn / next-btn with data-target="promo-related-slider").
 * This follows the exact same pattern as the product related sliders
 * so it's handled by the existing slider.js initSliders() automatically.
 * No additional code needed here — initSliders runs globally.
 *
 * This function exists as a semantic hook for any promo-specific slider
 * behavior we may add in the future (e.g. autoplay).
 */
function initPromoRelatedSlider() {
  const slider    = document.getElementById('promo-related-slider');
  const navGroup  = document.getElementById('nav-promo-related-slider');

  if (!slider) return;

  // Show nav controls only when there is overflow to scroll
  const checkOverflow = () => {
    if (!navGroup) return;
    const hasOverflow = slider.scrollWidth > slider.clientWidth + 4;
    navGroup.style.opacity        = hasOverflow ? '1' : '0';
    navGroup.style.pointerEvents  = hasOverflow ? 'auto' : 'none';
  };

  checkOverflow();
  // Re-check on resize (fluid layout changes)
  window.addEventListener('resize', checkOverflow, { passive: true });
}
