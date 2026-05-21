/**
 * Saar Biotech Master Entry Point
 * Bundled via Hugo Pipes (esbuild)
 */

import { initTabs, initHeader, initProductScroll, initAnchorScroll, initAccordion, initFooterYear, initScrollFades } from './modules/ui';
import { initAnimations, initCounters, initHeroCanvas } from './modules/animations';
import { initSearch } from './modules/search';
import { initProducts } from './modules/products';
import { initEnquiryModal } from './modules/modal';
import { initGallery } from './modules/gallery';
import { initCategoryGallery } from './modules/category';
import { initSliders } from './modules/slider';
import { initCategorySlider } from './modules/categorySlider';
import { initFAB } from './modules/fab';
import { initBackToTop } from './modules/back-to-top';
import { initContactPage } from './modules/contact';


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
  // safeInit("AnchorScroll", initAnchorScroll);
  safeInit("Accordion", initAccordion);
  safeInit("FooterYear", initFooterYear);
  safeInit("Search", initSearch);
  safeInit("Products", initProducts);
  safeInit("EnquiryModal", initEnquiryModal);
  safeInit("Gallery", initGallery);
  safeInit("CategoryGallery", initCategoryGallery);
  safeInit("ScrollFades", initScrollFades);
  safeInit("Sliders", initSliders);
  safeInit("CategorySlider", initCategorySlider);
  safeInit("ContactFAB", initFAB);
  safeInit("BackToTop", initBackToTop);
  safeInit("ContactPage", initContactPage);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
