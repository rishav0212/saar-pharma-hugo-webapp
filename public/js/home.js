(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeInit(fn) {
    try { fn(); } catch (e) { console.error("Saar Init Error: ", e); }
  }

  function initHeroCanvas() {
    if (reduceMotion || !window.VANTA || !window.VANTA.NET) return;
    
    var vantaEffect = window.VANTA.NET({
      el: "#hero-canvas",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
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
    
    // Clean up on page hide if needed
    window.addEventListener('unload', function() {
      if (vantaEffect) vantaEffect.destroy();
    });
  }

  function initAnimations() {
    // Select all logical sections and their key children for site-wide animation
    var animated = Array.prototype.slice.call(document.querySelectorAll("[data-animate], .section > .container > div, .section-head, .bento-grid, .timeline, .unit-grid, .tab-block, .planner-shell, .faq-list, .footer-content"));
    if (!animated.length) return;

    if (!reduceMotion && window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      animated.forEach(function (el) {
        // Skip if already has a parent that is being animated (to avoid double animation)
        if (el.parentElement && el.parentElement.hasAttribute("data-animate")) return;

        var isHero = !!el.closest(".section--hero");
        var isStaggerContainer = el.hasAttribute("data-animate-stagger") || 
                                 el.classList.contains("bento-grid") || 
                                 el.classList.contains("unit-grid") || 
                                 el.classList.contains("timeline") ||
                                 el.classList.contains("metric-grid") ||
                                 el.classList.contains("faq-list");
        
        var type = el.getAttribute("data-animate-type") || (isHero ? "fade-up" : "fade-in");
        var delay = Number(el.getAttribute("data-delay") || 0);

        if (isStaggerContainer) {
          var childrenSelector = el.getAttribute("data-animate-stagger") || "> *";
          var children = el.querySelectorAll(childrenSelector);
          window.gsap.set(children, { autoAlpha: 0, y: 40, scale: 0.97 });
          
          window.gsap.to(children, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          });
          return;
        }

        // Individual element animations
        var initial = { autoAlpha: 0, y: 0, x: 0, scale: 1 };
        var target = { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 1.6, ease: "expo.out", delay: delay };

        if (type === "slide-right") initial.x = -60;
        else if (type === "slide-left") initial.x = 60;
        else if (type === "scale-in") initial.scale = 0.94;
        else initial.y = isHero ? 60 : 30; // default fade-up

        window.gsap.set(el, initial);
        window.gsap.to(el, {
          ...target,
          scrollTrigger: isHero ? null : {
            trigger: el,
            start: "top 90%",
            once: true
          }
        });
      });

      // Header reveal
      window.gsap.from(".site-header", {
        y: -100, autoAlpha: 0,
        duration: 1.2, ease: "expo.out", delay: 0.6
      });
      
      document.body.style.opacity = "1";
    } else {
      document.body.style.opacity = "1";
      animated.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  function initCounters() {
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!counters.length) return;

    function runCounter(el) {
      var target = Number(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      
      if (window.gsap) {
        var obj = { val: 0 };
        window.gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: "power3.out",
          onUpdate: function() {
            el.textContent = Math.round(obj.val).toLocaleString("en-IN") + suffix;
          }
        });
      } else {
        var start = performance.now();
        var duration = 2000;
        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 4);
          var current = Math.round(target * eased);
          el.textContent = current.toLocaleString("en-IN") + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setTimeout(function() { runCounter(entry.target); }, 150);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function initTabs() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab-btn, .planner-tab");
      if (!btn) return;
      
      var isPlanner = btn.classList.contains("planner-tab");
      var container = isPlanner ? btn.closest(".planner-shell") : btn.closest(".tab-block");
      if (!container) return;
      
      var targetAttr = isPlanner ? "data-planner-tab" : "data-tab";
      var panelAttr = isPlanner ? "data-planner-panel" : "data-tab";
      var btnClass = isPlanner ? ".planner-tab" : ".tab-btn";
      var panelClass = isPlanner ? ".planner-panel" : ".tab-panel";
      
      var target = btn.getAttribute(targetAttr);
      var buttons = Array.prototype.slice.call(container.querySelectorAll(btnClass));
      var panels = Array.prototype.slice.call(container.querySelectorAll(panelClass));
      
      buttons.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      panels.forEach(function (p) { 
        p.classList.remove("is-active"); 
        p.setAttribute("hidden", ""); 
      });
      
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      
      var targetPanel = container.querySelector(panelClass + '[' + panelAttr + '="' + target + '"]');
      if (targetPanel) {
        targetPanel.classList.add("is-active");
        targetPanel.removeAttribute("hidden");
        
        // Dynamic entry animation for panel
        if (window.gsap) {
          window.gsap.fromTo(targetPanel, 
            { autoAlpha: 0, y: 10 }, 
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }
      }
    });
  }

  function initProductScroll() {
    var track = document.getElementById('products-scroll-track');
    var prevBtn = document.getElementById('products-prev');
    var nextBtn = document.getElementById('products-next');
    if (!track) return;
    
    function getScrollAmount() {
      var card = track.querySelector('.product-scroll-card');
      if (window.innerWidth < 768) return track.clientWidth * 0.85;
      return card ? card.offsetWidth + 24 : 344;
    }
    
    if (prevBtn) prevBtn.addEventListener('click', function() { track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', function() { track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); });

    var bar = document.querySelector('.scroll-indicator__bar');
    if (bar) {
      track.addEventListener('scroll', function() {
        var maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;
        bar.style.width = ((track.scrollLeft / maxScroll) * 100) + '%';
      }, { passive: true });
    }
  }

  // Run
  safeInit(initHeroCanvas);
  safeInit(initAnimations);
  safeInit(initCounters);
  safeInit(initTabs);
  safeInit(initProductScroll);
  
  if (window.lucide) safeInit(function() { window.lucide.createIcons(); });
})();



