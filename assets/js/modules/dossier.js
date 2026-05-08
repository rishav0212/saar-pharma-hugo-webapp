/**
 * Saar Biotech: Clinical Dossier Interaction
 * Logic for shuffling multi-image galleries in therapeutic categories
 */

export function initDossierShuffle() {
  const visuals = document.querySelectorAll('.tab-dosage-visual');
  if (!visuals.length) return;

  visuals.forEach(visual => {
    let activeIndex = 0;
    const portfolio = visual.querySelector('.tab-dosage-portfolio');
    if (!portfolio) return;

    // Prevent text selection during rapid clicks
    visual.style.userSelect = 'none';

    visual.addEventListener('click', (e) => {
      // Don't shuffle if clicking links inside the visual (if any)
      if (e.target.closest('a, button:not(.tab-dosage-visual)')) return;

      // Cycle through 0, 1, 2
      activeIndex = (activeIndex + 1) % 3; 
      
      portfolio.setAttribute('data-active-index', activeIndex);
      
      // Optional: Add haptic-like visual feedback
      visual.classList.add('is-shuffling');
      setTimeout(() => visual.classList.remove('is-shuffling'), 300);
    });
  });
}
