/**
 * Saar Biotech Master Entry Point
 * Bundled via Hugo Pipes (esbuild)
 */

import { initTabs, initHeader, initProductScroll, initAnchorScroll, initFooterYear } from './modules/ui';
import { initAnimations, initCounters, initHeroCanvas } from './modules/animations';
import { initSearch } from './modules/search';
import { initProducts } from './modules/products';
import { initEnquiryModal } from './modules/modal';

function safeInit(name, fn) {
  try { 
    fn(); 
  } catch (e) { 
    console.error(`Saar Init Error [${name}]: `, e); 
  }
}

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function initLenis() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !window.Lenis) return;
  
  window.lenis = new window.Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.1
  });

  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Global Orchestration
const initAll = () => {
  safeInit("Icons", initIcons);
  safeInit("Lenis", initLenis);
  safeInit("Vanta", initHeroCanvas);
  safeInit("Animations", initAnimations);
  safeInit("Counters", initCounters);
  safeInit("Tabs", initTabs);
  safeInit("Header", initHeader);
  safeInit("ProductScroll", initProductScroll);
  safeInit("AnchorScroll", initAnchorScroll);
  safeInit("FooterYear", initFooterYear);
  safeInit("Search", initSearch);
  safeInit("Products", initProducts);
  safeInit("EnquiryModal", initEnquiryModal);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
