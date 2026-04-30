(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeInit(name, fn) {
    try { 
      fn(); 
    } catch (e) { 
      console.error("Saar Init Error [" + name + "]: ", e); 
    }
  }

  // --- 1. ICONS ---
  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  // --- 2. SMOOTH SCROLL (LENIS) ---
  function initLenis() {
    if (reduceMotion || !window.Lenis) return;
    var lenis = new window.Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1.1
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- 3. HERO BACKGROUND (VANTA) ---
  function initHeroCanvas() {
    if (!document.getElementById("hero-canvas") || reduceMotion || !window.VANTA || !window.VANTA.NET) return;
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

  // --- 4. GLOBAL ANIMATIONS ---
  function initAnimations() {
    var animated = document.querySelectorAll("[data-animate], .section-head, .bento-grid, .timeline, .unit-grid, .metric-grid, .faq-list, .article-grid, .copy-stack, .facility-board, .planner-shell, .product-autoplay-wrapper, .footer-content");
    if (!animated.length) return;

    // Use Intersection Observer for basic reveals
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = Number(el.getAttribute("data-delay") || 0);
          
          setTimeout(function() {
            el.classList.add("is-visible");
          }, delay * 1000);
          
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -100px 0px" });

    animated.forEach(function(el) {
      if (el.closest(".section--hero")) {
        setTimeout(function() { el.classList.add("is-visible"); }, 150);
      } else {
        observer.observe(el);
      }
    });

    // Special Header reveal
    var header = document.querySelector(".site-header");
    if (header) {
      setTimeout(function() { 
        header.style.opacity = "1"; 
        header.style.transform = "translateY(0)";
      }, 50);
    }
  }

  // --- 5. COUNTERS ---
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = Number(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          if (window.gsap) {
            var obj = { val: 0 };
            window.gsap.to(obj, {
              val: target, duration: 2.5, ease: "power4.out",
              onUpdate: function() { el.textContent = Math.round(obj.val).toLocaleString("en-IN") + suffix; }
            });
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { observer.observe(el); });
  }

  // --- 6. TABS ---
  function initTabs() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab-btn, .planner-tab");
      if (!btn) return;
      var isPlanner = btn.classList.contains("planner-tab");
      var container = isPlanner ? btn.closest(".planner-shell") : btn.closest(".tab-block");
      var targetAttr = isPlanner ? "data-planner-tab" : "data-tab";
      var panelAttr = isPlanner ? "data-planner-panel" : "data-tab";
      var btnClass = isPlanner ? ".planner-tab" : ".tab-btn";
      var panelClass = isPlanner ? ".planner-panel" : ".tab-panel";
      
      var target = btn.getAttribute(targetAttr);
      var btns = container.querySelectorAll(btnClass);
      var panels = container.querySelectorAll(panelClass);
      
      btns.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); p.setAttribute("hidden", ""); });
      
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var panel = container.querySelector(panelClass + '[' + panelAttr + '="' + target + '"]');
      if (panel) {
        panel.classList.add("is-active");
        panel.removeAttribute("hidden");
        if (window.gsap) window.gsap.fromTo(panel, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.4 });
      }
    });
  }

  // --- 7. NAV & HEADER ---
  function initHeader() {
    var header = document.querySelector(".site-header");
    var menuToggle = document.getElementById("menu-toggle");
    var mobileNav = document.getElementById("mobile-nav");
    if (!header) return;

    if (menuToggle && mobileNav) {
      function setMenu(open) {
        menuToggle.classList.toggle("open", open);
        mobileNav.classList.toggle("open", open);
        header.classList.toggle("nav-active", open);
        document.body.classList.toggle("nav-open", open);
      }
      menuToggle.addEventListener("click", function() { setMenu(!mobileNav.classList.contains("open")); });
      mobileNav.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("click", function() { setMenu(false); });
      });
    }

    window.addEventListener("scroll", function() {
      header.classList.toggle("scrolled", window.scrollY > 30);
    });
  }

  // --- 8. PRODUCT SCROLLER ---
  function initProductScroll() {
    var track = document.getElementById('products-scroll-track');
    var prevBtn = document.getElementById('products-prev');
    var nextBtn = document.getElementById('products-next');
    if (!track) return;
    function getScrollAmount() {
      if (window.innerWidth < 768) return track.clientWidth * 0.85;
      var card = track.querySelector('.product-scroll-card');
      return card ? card.offsetWidth + 24 : 344;
    }
    if (prevBtn) prevBtn.addEventListener('click', function() { track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', function() { track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); });
  }

  // RUN ALL
  function initAll() {
    safeInit("Icons", initIcons);
    safeInit("Lenis", initLenis);
    safeInit("Vanta", initHeroCanvas);
    safeInit("Animations", initAnimations);
    safeInit("Counters", initCounters);
    safeInit("Tabs", initTabs);
    safeInit("Header", initHeader);
    safeInit("ProductScroll", initProductScroll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
