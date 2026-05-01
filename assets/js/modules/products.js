/**
 * Saar Biotech — Products Module (Elite Search & Sync)
 * Handles: dual-search sync, category dropdown sync, smooth scrolling, scored search
 */
export function initProducts() {
  const page = document.getElementById('products-page');
  if (!page) return;

  const grid        = document.getElementById('products-grid');
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const mainSearch  = document.getElementById('products-search');
  const heroSearch  = document.getElementById('hero-search');
  const heroSelect  = document.getElementById('hero-cat-select');
  const filterSelect = document.getElementById('filter-cat-select'); // New dropdown in filter bar
  
  const cardWraps   = Array.from(document.querySelectorAll('.product-card-wrap'));
  const countEl     = document.getElementById('products-count');
  const activeLabel = document.getElementById('products-active-label');
  const emptyState  = document.getElementById('products-empty');

  if (!cardWraps.length) return;

  let currentFilter = 'all';
  let currentQuery  = '';

  // ─── Pre-Index Data ────────────────────────────────────────────
  const productData = cardWraps.map(wrap => ({
    el: wrap,
    cat: (wrap.dataset.category || '').toLowerCase().trim(),
    title: (wrap.dataset.title || '').toLowerCase(),
    comp: (wrap.dataset.composition || '').toLowerCase(),
    area: (wrap.dataset.area || '').toLowerCase(),
    desc: (wrap.dataset.desc || '').toLowerCase(),
    packs: (wrap.dataset.packs || '').toLowerCase()
  }));

  // ─── Sync Logic ───────────────────────────────────────────────
  function updateInputs(query, filter) {
    if (mainSearch) mainSearch.value = query;
    if (heroSearch) heroSearch.value = query;
    if (heroSelect) heroSelect.value = filter;
    if (filterSelect) filterSelect.value = filter;

    filterPills.forEach(p => {
      const pFilter = p.dataset.filter.toLowerCase().trim();
      p.classList.toggle('is-active', pFilter === filter);
    });
  }

  // ─── Apply Filters ─────────────────────────────────────────────
  function applyFilters(animate = false, source = 'filter') {
    let visibleCount = 0;
    const matches = [];

    productData.forEach(item => {
      const itemCats = item.cat.split(' ');
      const passesCategory = (currentFilter === 'all') || itemCats.includes(currentFilter);
      
      let score = 0;
      if (currentQuery) {
        // Priority Scoring: Title > Category > Desc > Others
        if (item.title.includes(currentQuery))       score += 2000;
        if (item.cat.includes(currentQuery))         score += 1000;
        if (item.desc.includes(currentQuery))        score += 500;
        if (item.comp.includes(currentQuery))        score += 250;
        if (item.area.includes(currentQuery))        score += 100;
        if (item.packs.includes(currentQuery))       score += 50;
      } else {
        score = 1;
      }

      if (passesCategory && score > 0) {
        matches.push({ item, score });
        visibleCount++;
      } else {
        // Smooth Hide
        item.el.classList.add('is-hidden');
        item.el.style.opacity = '0';
        item.el.style.transform = 'scale(0.95) translateY(20px)';
        item.el.style.pointerEvents = 'none';
      }
    });

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    // UX: Scroll down if searching from Hero
    if (source === 'hero' && (currentQuery.length > 0 || currentFilter !== 'all')) {
      const gridHeader = document.querySelector('.products-section');
      if (gridHeader) {
        window.scrollTo({
          top: gridHeader.offsetTop - 120,
          behavior: 'smooth'
        });
        
        // Transfer focus to main search
        setTimeout(() => {
          if (mainSearch && document.activeElement !== mainSearch) {
            mainSearch.focus();
            const val = mainSearch.value;
            mainSearch.value = '';
            mainSearch.value = val;
          }
        }, 400);
      }
    }

    // Render Grid with Order and Smooth Show
    matches.forEach(({ item }, index) => {
      item.el.classList.remove('is-hidden');
      item.el.style.order = index;
      item.el.style.pointerEvents = 'auto';

      if (animate) {
        // Delay each item slightly for a "wave" effect
        setTimeout(() => {
          item.el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          item.el.style.opacity = '1';
          item.el.style.transform = 'scale(1) translateY(0)';
        }, index * 15);
      } else {
        item.el.style.opacity = '1';
        item.el.style.transform = 'scale(1) translateY(0)';
      }
    });

    if (countEl) countEl.textContent = visibleCount;
    if (emptyState) emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
    if (activeLabel) {
      const activePill = document.querySelector('.filter-pill.is-active');
      activeLabel.textContent = activePill?.querySelector('.filter-pill__label')?.textContent || 'All Products';
    }
  }

  // ─── Event Listeners ──────────────────────────────────────────
  
  // Search Inputs Sync
  [mainSearch, heroSearch].forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      const isHero = e.target.id === 'hero-search';
      updateInputs(currentQuery, currentFilter);
      applyFilters(true, isHero ? 'hero' : 'main');
    });
  });

  // Category Dropdowns
  [heroSelect, filterSelect].forEach(select => {
    if (!select) return;
    select.addEventListener('change', (e) => {
      currentFilter = e.target.value.toLowerCase().trim();
      const isHero = e.target.id === 'hero-cat-select';
      updateInputs(currentQuery, currentFilter);
      applyFilters(true, isHero ? 'hero' : 'filter');
    });
  });

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter.toLowerCase().trim();
      if (filter === currentFilter) return;
      currentFilter = filter;
      updateInputs(currentQuery, currentFilter);
      window.history.replaceState(null, '', filter === 'all' ? '#' : `#${filter}`);
      applyFilters(true, 'filter');
    });
  });

  // Horizontal Scroll for Pills (Visual Polish)
  const pillsContainer = document.querySelector('.filter-pills');
  if (pillsContainer) {
    pillsContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        pillsContainer.scrollLeft += e.deltaY;
      }
    });
  }

  // Initial Sync from URL
  const hash = window.location.hash.replace('#', '').toLowerCase().trim();
  if (hash && hash !== 'all') {
    currentFilter = hash;
    updateInputs('', currentFilter);
  }

  applyFilters(false);
}
