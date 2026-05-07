/**
 * Category Hero Stack Slider
 * Handles the 3D card rotation logic for category landing pages.
 */
export function initCategorySlider() {
  const slider = document.getElementById('cat-hero-slider');
  if (!slider) return;

  const items = Array.from(slider.querySelectorAll('.cat-stack__item'));
  const dots = Array.from(slider.querySelectorAll('.cat-stack__dot'));
  const total = items.length;
  if (total < 1) return;

  let current = 0;
  let timer = null;
  const DURATION = 4500; // 4.5 seconds per slide

  function updateStack() {
    items.forEach((item, idx) => {
      // Clear all state classes
      item.classList.remove('is-top', 'is-middle', 'is-bottom', 'is-hidden', 'is-exit');

      // Calculate relative position in cycle
      const relIdx = (idx - current + total) % total;

      if (relIdx === 0) {
        item.classList.add('is-top');
      } else if (relIdx === 1) {
        item.classList.add('is-middle');
      } else if (relIdx === 2) {
        item.classList.add('is-bottom');
      } else if (relIdx === total - 1) {
        // The one that just left
        item.classList.add('is-exit');
      } else {
        item.classList.add('is-hidden');
      }
    });

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === current);
    });
  }

  function goTo(idx) {
    if (idx === current) return;
    current = idx;
    if (current >= total) current = 0;
    if (current < 0) current = total - 1;
    updateStack();
  }

  function next() {
    goTo((current + 1) % total);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, DURATION);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Event Bindings
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goTo(idx);
      startAutoplay();
    });
  });

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('is-middle') || item.classList.contains('is-bottom')) {
        goTo(idx);
        startAutoplay();
      }
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Initial Update & Start
  updateStack();
  if (total > 1) startAutoplay();
}
