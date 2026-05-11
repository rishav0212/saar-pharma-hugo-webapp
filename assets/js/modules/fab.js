/**
 * Floating Action Button (FAB) Module
 * Handles the interaction for the contact speed-dial
 */

export function initFAB() {
  const fab = document.getElementById('contact-fab');
  const trigger = document.getElementById('contact-fab-trigger');
  
  if (!fab || !trigger) return;

  let closeTimeout;

  // --- Scroll Logic: Only show after Hero ---
  const handleScroll = () => {
    // Show after scrolling 400px (typically past hero)
    if (window.scrollY > 400) {
      fab.classList.add('is-visible');
    } else {
      fab.classList.remove('is-visible');
      fab.classList.remove('contact-fab--active'); // Close menu if scrolled back to top
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  const toggleFAB = (e) => {
    e.stopPropagation();
    fab.classList.toggle('contact-fab--active');
  };

  const closeFAB = () => {
    fab.classList.remove('contact-fab--active');
  };

  trigger.addEventListener('click', toggleFAB);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) {
      closeFAB();
    }
  });

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFAB();
    }
  });

  // Handle Hover for Desktop
  // Only open when hovering the trigger button specifically
  trigger.addEventListener('mouseenter', () => {
    if (window.innerWidth > 1024 && fab.classList.contains('is-visible')) {
      clearTimeout(closeTimeout);
      fab.classList.add('contact-fab--active');
    }
  });

  // Stay open until the mouse leaves the whole container (including the menu)
  fab.addEventListener('mouseleave', () => {
    if (window.innerWidth > 1024) {
      closeTimeout = setTimeout(closeFAB, 150); // Small grace period
    }
  });
}
