/**
 * Saar Biotech — Unified Gallery Module
 * Handles: Product Filmstrip, Manual Slider, Autoplay, and Lightbox Zoom.
 * 
 * Replaces legacy Swiper-based logic with high-performance manual controls
 * optimized for the 'Elite Clinical' interface.
 */

export function initGallery() {
  const mainImg = document.getElementById('ps-main-img');
  const filmstrip = document.getElementById('ps-filmstrip');
  const progressEl = document.getElementById('ps-slide-progress');
  const frame = document.getElementById('ps-gallery-frame');
  const lightbox = document.getElementById('ps-lightbox');
  const lbImg = document.getElementById('ps-lb-img');
  const lbClose = document.getElementById('ps-lb-close');
  const lbPrev = document.getElementById('ps-lb-prev');
  const lbNext = document.getElementById('ps-lb-next');

  if (!mainImg) return;

  const thumbs = filmstrip ? Array.from(filmstrip.querySelectorAll('.ps-filmstrip-thumb')) : [];
  const dots = progressEl ? Array.from(progressEl.querySelectorAll('.ps-slide-dot')) : [];
  const srcs = thumbs.length ? thumbs.map(t => t.getAttribute('data-src')) : [mainImg.src];
  const total = srcs.length;
  let current = 0;
  let timer = null;
  const DELAY = 4000;

  /**
   * Switch main gallery image.
   */
  function goTo(idx, animateMain = true, isAuto = false) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    const src = srcs[idx];

    if (mainImg && animateMain) {
      // Cross-fade animation for main image
      mainImg.style.opacity = '0';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 220);
    } else if (mainImg) {
      mainImg.src = src;
    }

    // Sync visual indicators
    thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    
    // Only scroll thumbnails into view if it was a manual interaction (not autoplay)
    if (thumbs[idx] && !isAuto) {
      thumbs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    
    if (lbImg && lightbox && lightbox.classList.contains('is-open')) {
      lbImg.src = src;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (total < 2) return;
    timer = setInterval(() => goTo(current + 1, true, true), DELAY);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function openLightbox() {
    if (!lightbox || !lbImg) return;
    lbImg.src = srcs[current];
    if (mainImg) lbImg.alt = mainImg.alt;

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    stopAutoplay();

    if (window.gsap) {
      window.gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' });
      window.gsap.fromTo(lbImg, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(1.5)' });
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    const doClose = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      startAutoplay();
    };
    if (window.gsap) {
      window.gsap.to(lightbox, { opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: doClose });
    } else {
      doClose();
    }
  }

  // Event Bindings
  if (frame) frame.addEventListener('click', openLightbox);
  if (lbClose) lbClose.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1, false); });
  if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1, false); });
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => { goTo(idx); stopAutoplay(); startAutoplay(); });
  });
  
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => { goTo(idx); stopAutoplay(); startAutoplay(); });
  });

  // Keyboard Controls
  document.addEventListener('keydown', e => {
    const lbOpen = lightbox && lightbox.classList.contains('is-open');
    if (e.key === 'Escape' && lbOpen) { closeLightbox(); return; }
    if (e.key === 'ArrowRight') { goTo(current + 1, !lbOpen); if (!lbOpen) { stopAutoplay(); startAutoplay(); } }
    if (e.key === 'ArrowLeft') { goTo(current - 1, !lbOpen); if (!lbOpen) { stopAutoplay(); startAutoplay(); } }
  });

  // Touch Swipe Support
  function addSwipe(el, cb) {
    if (!el) return;
    let sx = 0;
    el.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const d = e.changedTouches[0].clientX - sx;
      if (Math.abs(d) > 40) cb(d);
    }, { passive: true });
  }

  addSwipe(frame, d => { goTo(d < 0 ? current + 1 : current - 1); stopAutoplay(); startAutoplay(); });
  addSwipe(lightbox, d => { goTo(d < 0 ? current + 1 : current - 1, false); });

  // Hover Interactions
  [frame, filmstrip].forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', stopAutoplay);
    el.addEventListener('mouseleave', startAutoplay);
  });

  // Initial State
  if (total > 1) startAutoplay();
}
