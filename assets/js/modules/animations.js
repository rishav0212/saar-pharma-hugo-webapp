/**
 * Saar Biotech Modular JS Engine
 * Module: Animations (Reveals, Counters, Vanta)
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initAnimations() {
  const animated = document.querySelectorAll("[data-animate], .section-head, .bento-grid, .timeline, .unit-grid, .metric-grid, .faq-list, .article-grid, .copy-stack, .facility-board, .planner-shell, .product-autoplay-wrapper, .footer-content, .product-card-wrap");
  if (!animated.length) return;

  // Single-Session Logic: Check if hero entrance has already played
  const hasVisited = sessionStorage.getItem("saar_visited");
  const isMobile = window.innerWidth < 768;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Stagger Logic: Check if parent wants staggered children
        const staggerGroup = el.closest('[data-animate-stagger]');
        let delay = Number(el.getAttribute("data-delay") || 0);
        
        if (staggerGroup) {
          const children = Array.from(staggerGroup.querySelectorAll('.product-card-wrap, [data-animate]'));
          const index = children.indexOf(el);
          if (index !== -1) {
            delay += (index * 0.1); // 100ms stagger between items
          }
        }
        
        if (window.gsap && !reduceMotion) {
          window.gsap.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1.2,
            delay: delay,
            ease: "power3.out",
            clearProps: "all"
          });
          el.classList.add("is-visible");
        } else {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay * 1000);
        }
        
        observer.unobserve(el);
      }
    });
  }, { 
    threshold: isMobile ? 0.05 : 0.15, 
    rootMargin: isMobile ? "0px 0px -30px 0px" : "0px 0px -100px 0px" 
  });

  animated.forEach((el) => {
    const isHero = el.closest(".section--hero") || el.closest(".section--about-hero") || el.closest(".products-hero");
    
    if (isHero && hasVisited) {
      // Skip entrance animations for returning session users (Rule 4)
      el.style.opacity = "1";
      el.style.transform = "none";
      el.classList.add("is-visible");
    } else {
      if (isHero) {
        setTimeout(() => { el.classList.add("is-visible"); }, 150);
      } else {
        observer.observe(el);
      }
    }
  });

  // Mark session as visited
  sessionStorage.setItem("saar_visited", "true");

  // Header initial reveal
  const header = document.querySelector(".site-header");
  if (header) {
    if (hasVisited) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    } else {
      setTimeout(() => { 
        header.style.opacity = "1"; 
        header.style.transform = "translateY(0)";
      }, 50);
    }
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

