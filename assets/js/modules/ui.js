/**
 * Saar Biotech Modular JS Engine
 * Module: UI Components (Tabs, Scrollers, Header)
 */

export function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn, .planner-tab');
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isPlanner = btn.classList.contains("planner-tab");
      const container = isPlanner ? btn.closest(".planner-shell") : btn.closest(".tab-block");
      if (!container) return;

      const targetAttr = isPlanner ? "data-planner-tab" : "data-tab";
      const panelAttr = isPlanner ? "data-planner-panel" : "data-tab";
      const btnClass = isPlanner ? ".planner-tab" : ".tab-btn";
      const panelClass = isPlanner ? ".planner-panel" : ".tab-panel";

      const target = btn.getAttribute(targetAttr);
      const btns = container.querySelectorAll(btnClass);
      const panels = container.querySelectorAll(panelClass);

      // 1. Update States
      btns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });

      panels.forEach((p) => {
        p.classList.remove("is-active");
        p.setAttribute("hidden", "");
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const panel = container.querySelector(`${panelClass}[${panelAttr}="${target}"]`);
      if (!panel) return;

      // 2. Show Panel
      panel.classList.add("is-active");
      panel.removeAttribute("hidden");
      
      if (window.gsap) {
        // Target inner content for smooth glide without whole-card flicker
        const innerItems = panel.querySelectorAll('.tab-panel__body, .tab-panel__visual, .tab-dosage-visual, .planner-panel__body, .planner-panel__visual');
        if (innerItems.length > 0) {
          window.gsap.fromTo(innerItems, 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
          );
        } else {
          window.gsap.fromTo(panel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      }

      // 3. Smart Scroll (Universal)
      if (!isPlanner && btn.classList.contains('tab-btn')) {
        const scrollContainer = container.closest(".ps-clinical-console, .section");
        if (scrollContainer) {
          const rect = scrollContainer.getBoundingClientRect();
          const headerHeight = document.querySelector(".site-header")?.offsetHeight || 80;
          
          // Only scroll if the container top is already scrolled off-screen or too high
          if (rect.top < -20) {
            const scrollTarget = window.scrollY + rect.top - headerHeight - 15;
            window.scrollTo({ 
              top: scrollTarget, 
              behavior: "smooth" 
            });
          }
        }
      }
    });
  });
}

export function initScrollFades() {
  const scrollers = document.querySelectorAll('.js-scroll-fade');
  if (!scrollers.length) return;

  scrollers.forEach(scroller => {
    // ─── Mouse Drag to Scroll Logic ───
    let isDown = false;
    let startX;
    let scrollLeftPos;

    scroller.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeftPos = scroller.scrollLeft;
    });

    scroller.addEventListener('mouseleave', () => {
      isDown = false;
    });

    scroller.addEventListener('mouseup', () => {
      isDown = false;
    });

    scroller.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault(); 
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 2; 
      scroller.scrollLeft = scrollLeftPos - walk;
    });
  });
}

export function initHeader() {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!header) return;

  if (menuToggle && mobileNav) {
    const setMenu = (open) => {
      menuToggle.classList.toggle("open", open);
      mobileNav.classList.toggle("open", open);
      header.classList.toggle("nav-active", open);
      document.body.classList.toggle("nav-open", open);
    };

    menuToggle.addEventListener("click", () => setMenu(!mobileNav.classList.contains("open")));
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMenu(false));
    });
  }

}

export function initProductScroll() {
  const track = document.getElementById('products-scroll-track');
  const prevBtn = document.getElementById('products-prev');
  const nextBtn = document.getElementById('products-next');
  if (!track) return;

  let pauseTimeout;
  const PAUSE_DURATION = 4000; // 4 seconds

  const triggerPause = () => {
    track.classList.add('is-paused');
    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => {
      track.classList.remove('is-paused');
    }, PAUSE_DURATION);
  };

  const getScrollAmount = () => {
    if (window.innerWidth < 768) return track.clientWidth * 0.85;
    const card = track.querySelector('.product-scroll-card');
    return card ? card.offsetWidth + 24 : 344;
  };

  // ─── Infinite Seamless Logic ───
  const handleInfiniteScroll = () => {
    const halfWidth = track.scrollWidth / 2;
    if (track.scrollLeft >= halfWidth) {
      track.scrollLeft -= halfWidth;
      if (typeof currentScrollPos !== 'undefined') currentScrollPos = track.scrollLeft;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += halfWidth;
      if (typeof currentScrollPos !== 'undefined') currentScrollPos = track.scrollLeft;
    }
  };

  track.addEventListener('scroll', handleInfiniteScroll);

  // High-Performance Autoplay (requestAnimationFrame)
  let currentScrollPos = track.scrollLeft;
  let autoplaySpeed = 1.5; // Slightly faster for more dynamic feel

  const step = () => {
    if (!track.classList.contains('is-paused') && !track.classList.contains('is-dragging')) {
      currentScrollPos += autoplaySpeed;
      track.scrollLeft = currentScrollPos;
    } else {
      currentScrollPos = track.scrollLeft; // Keep in sync while paused/dragging
    }
    requestAnimationFrame(step);
  };

  // Start the loop
  requestAnimationFrame(step);

  if (prevBtn) prevBtn.addEventListener('click', () => {
    triggerPause();
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    triggerPause();
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // Pause only when hovering over specific cards
  track.querySelectorAll('.product-scroll-card').forEach(card => {
    card.addEventListener('mouseenter', () => track.classList.add('is-paused'));
    card.addEventListener('mouseleave', () => track.classList.remove('is-paused'));
  });

  // Custom Draggable / Swipe Support
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDown = true;
    triggerPause();
    track.classList.add('is-dragging');
    startX = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  };

  const stopDragging = () => {
    isDown = false;
    track.classList.remove('is-dragging');
  };

  const move = (e) => {
    if (!isDown) return;
    triggerPause(); // Keep pausing as long as we move
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    const walk = (x - startX) * 2;
    track.scrollLeft = scrollLeft - walk;
  };

  track.addEventListener('mousedown', startDragging);
  track.addEventListener('touchstart', startDragging, { passive: true });

  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('touchend', stopDragging);

  track.addEventListener('mousemove', move);
  track.addEventListener('touchmove', move, { passive: false });
}

export function initAnchorScroll() {
  const header = document.querySelector(".site-header");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

export function initAccordion() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.faq-accordion__header');
    if (!header) return;

    const item = header.closest('.faq-accordion__item');
    if (!item) return;

    const isOpen = item.classList.contains('is-active');
    
    // Toggle current item
    item.classList.toggle('is-active');
  });
}

export function initFooterYear() {
  const year = document.getElementById("footer-year");
  if (year) year.textContent = new Date().getFullYear();
}
