/**
 * Saar Biotech — Product Gallery Module
 * Handles Swiper initialization with thumbs and premium transitions
 */
export function initGallery() {
  const mainSwiperEl = document.querySelector('.ps-main-swiper');
  const thumbSwiperEl = document.querySelector('.ps-thumb-swiper');

  if (!mainSwiperEl || !window.Swiper) return;

  // Wait a moment for layout to settle (especially important with aspect-ratio)
  setTimeout(() => {
    // 1. Initialize Thumbnails Swiper (if present)
  let thumbSwiper = null;
  if (thumbSwiperEl) {
    thumbSwiper = new window.Swiper('.ps-thumb-swiper', {
      spaceBetween: 12,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        640: { slidesPerView: 5 },
        1024: { slidesPerView: 6 }
      }
    });
  }

  // 2. Initialize Main Gallery Swiper
  const mainSwiper = new window.Swiper('.ps-main-swiper', {
    spaceBetween: 30,
    effect: 'slide', // Direct 'one-by-one' slide animation
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: thumbSwiper,
    },
    on: {
      init: function () {
        if (window.lucide) window.lucide.createIcons();
      },
    }
  });

  // 3. Pause autoplay on hover
  mainSwiperEl.addEventListener('mouseenter', () => mainSwiper.autoplay.stop());
  mainSwiperEl.addEventListener('mouseleave', () => mainSwiper.autoplay.start());
  }, 100);
}
