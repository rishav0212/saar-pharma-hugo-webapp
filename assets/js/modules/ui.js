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
        window.gsap.fromTo(panel, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.4 });
      }

      // 3. Smart Scroll (Product Page Only)
      if (!isPlanner && btn.classList.contains('tab-btn')) {
        const consoleSection = container.closest(".ps-clinical-console");
        if (consoleSection) {
          const rect = consoleSection.getBoundingClientRect();
          const headerHeight = document.querySelector(".site-header")?.offsetHeight || 80;
          
          // Only scroll if the console top is already scrolled off-screen
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
    const wrap = scroller.parentElement;
    if (!wrap) return;

    const updateFades = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      // If content doesn't scroll, remove fades
      if (scrollWidth <= clientWidth + 2) {
        wrap.classList.remove('has-scroll-left', 'has-scroll-right');
        return;
      }
      
      const isAtStart = scrollLeft <= 5;
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;
      
      wrap.classList.toggle('has-scroll-left', !isAtStart);
      wrap.classList.toggle('has-scroll-right', !isAtEnd);
    };

    scroller.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades, { passive: true });
    // Initial check (use small timeout to ensure layout is calculated)
    setTimeout(updateFades, 100);

    // ─── Mouse Drag to Scroll Logic ───
    let isDown = false;
    let startX;
    let scrollLeftPos;

    scroller.addEventListener('mousedown', (e) => {
      isDown = true;
      scroller.classList.add('is-dragging');
      startX = e.pageX - scroller.offsetLeft;
      scrollLeftPos = scroller.scrollLeft;
    });

    scroller.addEventListener('mouseleave', () => {
      isDown = false;
      scroller.classList.remove('is-dragging');
    });

    scroller.addEventListener('mouseup', () => {
      isDown = false;
      scroller.classList.remove('is-dragging');
    });

    scroller.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault(); // Prevent text selection
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
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

  const getScrollAmount = () => {
    if (window.innerWidth < 768) return track.clientWidth * 0.85;
    const card = track.querySelector('.product-scroll-card');
    return card ? card.offsetWidth + 24 : 344;
  };

  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // Custom Draggable / Swipe Support
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDown = true;
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
