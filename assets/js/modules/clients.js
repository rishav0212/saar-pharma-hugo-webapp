/**
 * Saar Biotech Modular JS Engine
 * Module: B2B Clients Minimalist Logo Wall
 */

export function initClientWall() {
  const wall = document.querySelector('.clients-logo-wall');
  if (!wall) return;

  const tiles = wall.querySelectorAll('.logo-tile');
  const toggleBtn = document.getElementById('logo-wall-toggle');
  
  if (!tiles.length) return;

  // ─── Show More / Less Expansion Logic ───
  if (toggleBtn) {
    const btnText = toggleBtn.querySelector('span');

    toggleBtn.addEventListener('click', () => {
      const isExpanded = wall.classList.contains('is-expanded');

      if (isExpanded) {
        // ─── Collapse Wall ───
        wall.classList.remove('is-expanded');
        if (btnText) btnText.textContent = "Show All Partner Brands";
        
        // Smart Scroll: Smoothly scroll the user back to the top of the clients section
        // so they don't get disoriented when the grid closes and page height shrinks.
        const headerHeight = document.querySelector(".site-header")?.offsetHeight || 70;
        const sectionTop = document.getElementById('clients')?.getBoundingClientRect().top || 0;
        
        window.scrollTo({
          top: window.scrollY + sectionTop - headerHeight - 15,
          behavior: 'smooth'
        });
      } else {
        // ─── Expand Wall ───
        wall.classList.add('is-expanded');
        if (btnText) btnText.textContent = "Show Less";

        // GSAP Staggered Entrance Animation for newly revealed hidden tiles
        if (window.gsap) {
          const hiddenTiles = wall.querySelectorAll('.logo-tile.logo-tile--hidden');
          if (hiddenTiles.length > 0) {
            window.gsap.killTweensOf(hiddenTiles);
            window.gsap.fromTo(hiddenTiles, 
              { opacity: 0, scale: 0.9, y: 15 },
              { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.45, 
                stagger: 0.05, 
                ease: "power2.out",
                clearProps: "transform,opacity" // Clear inline styles once animated
              }
            );
          }
        }
      }
    });
  }

  // ─── Mobile/Tablet Touch Interaction ───
  const handleTouchToggle = (e) => {
    // Only apply touch toggling on mobile/tablet viewports
    if (window.innerWidth > 767) return;

    const tile = e.target.closest('.logo-tile');
    
    if (tile) {
      const isAlreadyHovered = tile.classList.contains('is-hovered');

      e.stopPropagation();

      // Close all other active tiles
      tiles.forEach(t => {
        if (t !== tile) t.classList.remove('is-hovered');
      });

      // Toggle current tile
      if (isAlreadyHovered) {
        tile.classList.remove('is-hovered');
      } else {
        tile.classList.add('is-hovered');
      }
    } else {
      // Tap outside closed all active tiles
      tiles.forEach(t => t.classList.remove('is-hovered'));
    }
  };

  document.addEventListener('click', handleTouchToggle);

  // ─── Keyboard Focus Accessibility ───
  tiles.forEach(tile => {
    tile.addEventListener('focus', () => {
      tiles.forEach(t => {
        if (t !== tile) t.classList.remove('is-hovered');
      });
      tile.classList.add('is-hovered');
    });

    tile.addEventListener('blur', () => {
      tile.classList.remove('is-hovered');
    });
  });
}
