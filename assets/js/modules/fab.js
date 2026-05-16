/**
 * Floating Action Button (FAB) Module
 * Handles the interaction for the contact speed-dial
 */

export function initFAB() {
  const fab = document.getElementById('contact-fab');
  const trigger = document.getElementById('contact-fab-trigger');
  
  if (!fab || !trigger) return;

  let isFooterVisible = false;
  let closeTimeout;
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
    if (window.scrollY > 400 && !isFooterVisible) {
      fab.classList.add('is-visible');
    } else {
      fab.classList.remove('is-visible');
      fab.classList.remove('contact-fab--active'); 
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 

  const toggleFAB = (e) => {
    e.stopPropagation();
    fab.classList.toggle('contact-fab--active');
  };

  const closeFAB = () => {
    fab.classList.remove('contact-fab--active');
  };

  trigger.addEventListener('click', toggleFAB);

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) {
      closeFAB();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFAB();
    }
  });

  // --- Desktop Interactions (Hover & Proximity) ---
  if (window.innerWidth > 1024) {
    const menu = document.getElementById('contact-fab-menu');

    // 1. Auto-open menu on trigger hover
    trigger.addEventListener('mouseenter', () => {
      if (fab.classList.contains('is-visible')) {
        clearTimeout(closeTimeout);
        fab.classList.add('contact-fab--active');
      }
    });

    // 2. Keep open when hovering the menu itself
    if (menu) {
      menu.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
      });
    }

    // 3. Auto-close menu when leaving the whole FAB container
    fab.addEventListener('mouseleave', () => {
      closeTimeout = setTimeout(closeFAB, 400); // 400ms grace period
    });

    // 3. Proximity hint ("Connect with Experts")
    document.addEventListener('mousemove', (e) => {
      if (!fab.classList.contains('is-visible')) return;
      
      const rect = trigger.getBoundingClientRect();
      const triggerX = rect.left + rect.width / 2;
      const triggerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - triggerX, 2) + 
        Math.pow(e.clientY - triggerY, 2)
      );

      if (distance < 160) {
        fab.classList.add('contact-fab--show-hint');
      } else {
        fab.classList.remove('contact-fab--show-hint');
      }
    }, { passive: true });
  }
}
