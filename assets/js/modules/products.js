/**
 * Saar Biotech — Products Module (Final Elite)
 * Handles: robust category filter, scored search, staggered reveals, URL state
 */
export function initProducts() {
  const page = document.getElementById('products-page');
  if (!page) return;

  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const searchInput = document.getElementById('products-search');
  const cardWraps   = Array.from(document.querySelectorAll('.product-card-wrap'));
  const countEl     = document.getElementById('products-count');
  const activeLabel = document.getElementById('products-active-label');
  const emptyState  = document.getElementById('products-empty');

  if (!cardWraps.length) return;

  let currentFilter = 'all';
  let currentQuery  = '';

  // ─── Cache Data ────────────────────────────────────────────────
  const productData = cardWraps.map(wrap => ({
    el: wrap,
    cat: (wrap.dataset.category || '').toLowerCase().trim(), // Standardize
    title: (wrap.dataset.title || '').toLowerCase(),
    comp: (wrap.dataset.composition || '').toLowerCase(),
    area: (wrap.dataset.area || '').toLowerCase(),
  }));

  // ─── URL State ──────────────────────────────────────────────────
  const hash = window.location.hash.replace('#', '').toLowerCase().trim();
  if (hash && hash !== 'all') {
    currentFilter = hash;
    // Set initial active pill
    filterPills.forEach(p => {
      const pFilter = p.dataset.filter.toLowerCase().trim();
      p.classList.toggle('is-active', pFilter === currentFilter);
    });
  }

  // ─── Apply Filter & Search ──────────────────────────────────────
  function applyFilters(animate = false) {
    let visibleCount = 0;
    const matches = [];

    productData.forEach(item => {
      // Split space-separated categories and check if filter matches any
      const itemCats = item.cat.split(' ');
      const passesCategory = (currentFilter === 'all') || itemCats.includes(currentFilter);
      let score = 0;

      if (currentQuery) {
        // Scoring: Higher points for composition matches
        if (item.comp.includes(currentQuery)) score += 100;
        if (item.title.includes(currentQuery)) score += 50;
        if (item.area.includes(currentQuery)) score += 25;
      } else {
        score = 1; // Basic visibility if no search
      }

      if (passesCategory && score > 0) {
        matches.push({ item, score });
        visibleCount++;
      } else {
        item.el.classList.add('is-hidden');
        item.el.style.opacity = '0';
        item.el.style.transform = 'translateY(10px)';
      }
    });

    // Sort visible results by score
    matches.sort((a, b) => b.score - a.score);

    // Render Results with Stagger
    matches.forEach(({ item }, index) => {
      item.el.classList.remove('is-hidden');
      item.el.style.order = index; // Keep sorting via CSS order

      if (animate) {
        // Force reset
        item.el.style.opacity = '0';
        item.el.style.transform = 'translateY(15px)';
        item.el.style.transition = 'none';
        
        void item.el.offsetWidth;

        setTimeout(() => {
          item.el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          item.el.style.opacity = '1';
          item.el.style.transform = 'translateY(0)';
        }, index * 30);
      } else {
        item.el.style.opacity = '1';
        item.el.style.transform = 'translateY(0)';
        item.el.style.transition = 'none';
      }
    });

    // UI Updates
    if (countEl) countEl.textContent = visibleCount;
    if (emptyState) emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
    
    if (activeLabel) {
      const activePill = document.querySelector('.filter-pill.is-active');
      activeLabel.textContent = activePill?.querySelector('.filter-pill__label')?.textContent || 'All Formulations';
    }
  }

  // ─── Events ─────────────────────────────────────────────────────
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter.toLowerCase().trim();
      if (filter === currentFilter) return;

      filterPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      currentFilter = filter;
      window.history.replaceState(null, '', filter === 'all' ? '#' : `#${filter}`);
      
      applyFilters(true);
    });
  });

  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        currentQuery = e.target.value.trim().toLowerCase();
        applyFilters(true);
      }, 150);
    });
  }

  // Initial Run
  applyFilters(false);
}
