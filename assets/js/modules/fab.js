/**
 * Floating Action Button (FAB) Module
 * Handles the interaction for the contact speed-dial
 */

export function initFAB() {
  const fab = document.getElementById('contact-fab');
  const trigger = document.getElementById('contact-fab-trigger');
  
  if (!fab || !trigger) return;


  let isFooterVisible = false;
  const footer = document.querySelector('.site-footer');

  if (footer) {
    const observer = new IntersectionObserver((entries) => {
      isFooterVisible = entries[0].isIntersecting;
      handleScroll();
    }, { rootMargin: "0px" });
    observer.observe(footer);
  }

  // --- Scroll Logic: Only show after Hero, hide at Footer ---
  const handleScroll = () => {
    // Show after scrolling 400px (typically past hero) AND footer is not visible
    if (window.scrollY > 400 && !isFooterVisible) {
      fab.classList.add('is-visible');
    } else {
      fab.classList.remove('is-visible');
      fab.classList.remove('contact-fab--active'); // Close menu if hidden
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

  // Handle Proximity Hover for Hint (Desktop only)
  // This allows the hint to appear when the mouse is "near" the button
  // without needing a large invisible container that blocks clicks.
  if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      if (!fab.classList.contains('is-visible')) return;
      
      const rect = trigger.getBoundingClientRect();
      const triggerX = rect.left + rect.width / 2;
      const triggerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - triggerX, 2) + 
        Math.pow(e.clientY - triggerY, 2)
      );

      // Show hint if within 150px proximity
      if (distance < 150) {
        fab.classList.add('contact-fab--show-hint');
      } else {
        fab.classList.remove('contact-fab--show-hint');
      }
    }, { passive: true });
  }
  // The menu now stays open until the user clicks away or clicks the trigger again.
  // This is more standard for click-to-open components.
}
