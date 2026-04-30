/**
 * Saar Biotech Modular JS Engine
 * Module: Animations (Reveals, Counters, Vanta)
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initAnimations() {
  const animated = document.querySelectorAll("[data-animate], .section-head, .bento-grid, .timeline, .unit-grid, .metric-grid, .faq-list, .article-grid, .copy-stack, .facility-board, .planner-shell, .product-autoplay-wrapper, .footer-content");
  if (!animated.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.getAttribute("data-delay") || 0);
        
        setTimeout(() => {
          el.classList.add("is-visible");
        }, delay * 1000);
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -100px 0px" });

  animated.forEach((el) => {
    if (el.closest(".section--hero")) {
      setTimeout(() => { el.classList.add("is-visible"); }, 150);
    } else {
      observer.observe(el);
    }
  });

  // Header initial reveal
  const header = document.querySelector(".site-header");
  if (header) {
    setTimeout(() => { 
      header.style.opacity = "1"; 
      header.style.transform = "translateY(0)";
    }, 50);
  }
}

export function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        
        if (window.gsap) {
          const obj = { val: 0 };
          window.gsap.to(obj, {
            val: target, 
            duration: 2.5, 
            ease: "power4.out",
            onUpdate: () => { 
              el.textContent = Math.round(obj.val).toLocaleString("en-IN") + suffix; 
            }
          });
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach((el) => { observer.observe(el); });
}

export function initHeroCanvas() {
  const canvasEl = document.getElementById("hero-canvas");
  if (!canvasEl || reduceMotion || !window.VANTA || !window.VANTA.NET) return;
  
  window.VANTA.NET({
    el: "#hero-canvas",
    mouseControls: true,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x247c74,
    backgroundColor: 0x060f14,
    points: 8.00,
    maxDistance: 20.00,
    spacing: 18.00
  });
}
