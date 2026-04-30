/**
 * Saar Biotech Modular JS Engine
 * Module: UI Components (Tabs, Scrollers, Header)
 */

export function initTabs() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn, .planner-tab");
    if (!btn) return;
    
    const isPlanner = btn.classList.contains("planner-tab");
    const container = isPlanner ? btn.closest(".planner-shell") : btn.closest(".tab-block");
    const targetAttr = isPlanner ? "data-planner-tab" : "data-tab";
    const panelAttr = isPlanner ? "data-planner-panel" : "data-tab";
    const btnClass = isPlanner ? ".planner-tab" : ".tab-btn";
    const panelClass = isPlanner ? ".planner-panel" : ".tab-panel";
    
    const target = btn.getAttribute(targetAttr);
    const btns = container.querySelectorAll(btnClass);
    const panels = container.querySelectorAll(panelClass);
    
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
    if (panel) {
      panel.classList.add("is-active");
      panel.removeAttribute("hidden");
      if (window.gsap) {
        window.gsap.fromTo(panel, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.4 });
      }
    }
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

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  });
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
      const headerHeight = (header ? header.getBoundingClientRect().height : 72) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

export function initFooterYear() {
  const year = document.getElementById("footer-year");
  if (year) year.textContent = new Date().getFullYear();
}
