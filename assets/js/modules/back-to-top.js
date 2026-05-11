/**
 * Back to Top Module
 * Handles visibility, inactivity fading, and smooth scrolling
 */

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let idleTimer;
  const IDLE_TIMEOUT = 5000; // 5 seconds

  const showButton = () => {
    btn.classList.remove('is-inactive');
    btn.classList.add('is-visible');
    
    // Reset idle timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      btn.classList.add('is-inactive');
    }, IDLE_TIMEOUT);
  };

  const hideButton = () => {
    btn.classList.remove('is-visible');
    btn.classList.remove('is-inactive');
    clearTimeout(idleTimer);
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 400) {
      showButton();
    } else {
      hideButton();
    }
  };

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  btn.addEventListener('click', scrollToTop);

  // Initial check
  handleScroll();
}
