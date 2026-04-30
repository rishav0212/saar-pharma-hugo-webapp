(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.getElementById("site-header");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function initHeader() {
    if (!header) return;

    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setMenu(open) {
    if (!menuToggle || !mobileNav || !header) return;
    menuToggle.classList.toggle("open", open);
    mobileNav.classList.toggle("open", open);
    header.classList.toggle("nav-active", open);
    document.body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  }

  function initMenu() {
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener("click", function () {
      setMenu(!mobileNav.classList.contains("open"));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  function initLenis() {
    if (reduceMotion || !window.Lenis) return;

    var lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      syncTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href").slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        var headerHeight = (header ? header.getBoundingClientRect().height : 72) + 8;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  function initFooterYear() {
    var year = document.getElementById("footer-year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    initIcons();
    initHeader();
    initMenu();
    initLenis();
    initAnchorScroll();
    initFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
