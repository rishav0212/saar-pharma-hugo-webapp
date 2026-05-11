/**
 * Contact Page Module
 * Handles: Clipboard utility for contact details and entry animations.
 */
export function initContactPage() {
  
  // ─── 1. COPY TO CLIPBOARD ───────────────────────────────────────────
  const copyButtons = document.querySelectorAll('[data-copy]');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's a link, we might want to still allow the default action (tel:, mailto:) 
      // but also copy to clipboard.
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.classList.add('is-copied');
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('is-copied');
        }, 2000);
      });
    });
  });

  // ─── 2. ENTRANCE ANIMATIONS ──────────────────────────────────────────
  // Note: Most animations are handled by global scroll observer (data-animate),
  // but we can add specific contact page flourishes here if needed.
}
