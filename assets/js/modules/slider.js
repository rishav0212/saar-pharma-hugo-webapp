/**
 * Related Products Auto-Slider Module
 * Handles auto-play, navigation, and responsive overflow detection.
 */
export function initSliders() {
  const sliders = document.querySelectorAll('.ps-slider-viewport');

  sliders.forEach(slider => {
    const id = slider.id;
    const navGroup = document.getElementById(`nav-${id}`);
    if (!navGroup) return;

    const nextBtn = navGroup.querySelector(`.next-btn`);
    const prevBtn = navGroup.querySelector(`.prev-btn`);
    let autoPlayInterval = null;

    const getScrollStep = () => {
      const item = slider.querySelector('.ps-slider-item');
      return item ? (item.offsetWidth + 32) : 300;
    };

    const moveNext = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 20) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }
    };

    const movePrev = () => {
      if (slider.scrollLeft <= 20) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      }
    };

    const startAutoPlay = () => {
      if (autoPlayInterval) return;
      autoPlayInterval = setInterval(moveNext, 3000); // 3-second interval
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    };

    const checkOverflow = () => {
      if (slider.scrollWidth > slider.clientWidth + 10) {
        navGroup.classList.add('is-visible');
        startAutoPlay();
      } else {
        navGroup.classList.remove('is-visible');
        stopAutoPlay();
      }
    };

    // Event Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        moveNext();
        setTimeout(startAutoPlay, 3000);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        movePrev();
        setTimeout(startAutoPlay, 3000);
      });
    }

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', () => {
      if (slider.scrollWidth > slider.clientWidth + 10) startAutoPlay();
    });

    // Periodic check for dynamic content or layout shifts
    setTimeout(checkOverflow, 800);
    window.addEventListener('resize', checkOverflow);
  });
}
