/**
 * Saar Biotech: Category Hero Gallery Interaction
 * Logic for shuffling multi-image galleries in therapeutic categories
 * Optimized with smart automatic rotation, manual overrides, and hover pauses
 */

export function initCategoryGallery() {
  const visuals = document.querySelectorAll('.tab-dosage-visual');
  if (!visuals.length) return;

  visuals.forEach(visual => {
    let activeIndex = 0;
    const portfolio = visual.querySelector('.tab-dosage-portfolio');
    if (!portfolio) return;

    // Prevent text selection during rapid clicks
    visual.style.userSelect = 'none';

    // Auto-cycle state variables
    let autoCycleInterval = null;
    let isHovered = false;

    // Setup manual click rotation
    visual.addEventListener('click', (e) => {
      // Don't shuffle if clicking links inside the visual (if any)
      if (e.target.closest('a, button:not(.tab-dosage-visual)')) return;

      // Manual cycle
      cycleNext();

      // Reset auto-cycle timer to prevent immediate jumping after a manual click
      resetAutoCycle();
    });

    // Core cycling routine
    function cycleNext() {
      activeIndex = (activeIndex + 1) % 3;
      portfolio.setAttribute('data-active-index', activeIndex);
      
      // Visual feedback feedback
      visual.classList.add('is-shuffling');
      setTimeout(() => visual.classList.remove('is-shuffling'), 300);
    }

    // Auto cycle routines
    function startAutoCycle() {
      if (autoCycleInterval) return;
      autoCycleInterval = setInterval(() => {
        if (!isHovered) {
          cycleNext();
        }
      }, 3000); // Cycle every 3 seconds
    }

    function stopAutoCycle() {
      if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
        autoCycleInterval = null;
      }
    }

    function resetAutoCycle() {
      stopAutoCycle();
      startAutoCycle();
    }

    // Pause on hover
    visual.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoCycle();
    });

    // Resume on mouse leave
    visual.addEventListener('mouseleave', () => {
      isHovered = false;
      startAutoCycle();
    });

    // Initialize auto-cycling on page load
    startAutoCycle();
  });
}
