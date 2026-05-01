/**
 * Saar Biotech — Products Module (Elite Search & Sync)
 * Handles: dual-search sync, ticker clicks, custom autocomplete, and scored filtering
 */
export function initProducts() {
  const page = document.getElementById('products-page');
  if (!page) return;

  const grid         = document.getElementById('products-grid');
  const filterPills  = document.querySelectorAll('.filter-pill[data-filter]');
  const mainSearch   = document.getElementById('products-search');
  const heroSearch   = document.getElementById('hero-search');
  const heroSelect   = document.getElementById('hero-cat-select');
  const suggestionsBox = document.getElementById('search-suggestions');
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  
  const cardWraps    = Array.from(document.querySelectorAll('.product-card-wrap'));
  const countEl      = document.getElementById('products-count');
  const activeLabel  = document.getElementById('products-active-label');
  const emptyState   = document.getElementById('products-empty');

  if (!cardWraps.length) return;

  let currentFilter = 'all';
  let currentQuery  = '';
  let searchTimeout = null;

  // ─── Pre-Index Data ────────────────────────────────────────────
  const productData = cardWraps.map(el => ({
    el: el,
    categories: (el.dataset.categories || '').toLowerCase(),
    cat: (el.dataset.category || '').toLowerCase().trim(),
    title: (el.dataset.title || '').toLowerCase(),
    comp: (el.dataset.composition || '').toLowerCase(),
    area: (el.dataset.area || '').toLowerCase(),
    desc: (el.dataset.desc || '').toLowerCase(),
    packs: (el.dataset.packs || '').toLowerCase()
  }));

  // ─── Sync Logic ───────────────────────────────────────────────
  function updateInputs(query, filter) {
    if (mainSearch) mainSearch.value = query;
    if (heroSearch) heroSearch.value = query;
    if (heroSelect) heroSelect.value = filter;

    filterPills.forEach(p => {
      const pFilter = p.dataset.filter.toLowerCase().trim();
      p.classList.toggle('is-active', pFilter === filter);
    });
  }

  // ─── Apply Filters (Phase-Out & Slide Logic) ────────────────────
  function applyFilters(animate = false) {
    let visibleCount = 0;
    const matches = [];

    // Phase 1: Fade out everything that doesn't match
    productData.forEach(item => {
      const itemCats = item.cat.split(' ').filter(Boolean); 
      const passesCategory = (currentFilter === 'all') || itemCats.includes(currentFilter);
      
      let score = 0;
      if (currentQuery) {
        if (item.title.includes(currentQuery))       score += 2000;
        if (item.categories.includes(currentQuery))  score += 1500;
        if (item.desc.includes(currentQuery))        score += 500;
        if (item.comp.includes(currentQuery))        score += 250;
        if (item.area.includes(currentQuery))        score += 100;
        if (item.packs.includes(currentQuery))       score += 50;
      } else {
        score = 1;
      }

      const isMatch = passesCategory && score > 0;

      if (isMatch) {
        matches.push({ item, score });
        visibleCount++;
      } else {
        // Start fade out immediately (Faster)
        item.el.style.transition = 'all 0.3s ease-out';
        item.el.style.opacity = '0';
        item.el.style.transform = 'scale(0.9) translateY(20px)';
      }
    });

    // Phase 2: Wait for fade-out, then reflow layout and fade-in matches
    setTimeout(() => {
      // Hide non-matches from layout
      productData.forEach(item => {
        const itemCats = item.cat.split(' ').filter(Boolean);
        const isMatch = (currentFilter === 'all' || itemCats.includes(currentFilter)) && 
                        (!currentQuery || matches.some(m => m.item === item));
        
        if (!isMatch) {
          item.el.classList.add('is-hidden');
        } else {
          item.el.classList.remove('is-hidden');
        }
      });

      // Sort and Reveal Matches
      matches.sort((a, b) => b.score - a.score);
      matches.forEach(({ item }, index) => {
        item.el.style.order = index;
        
        if (animate) {
          // Faster staggered ripple in
          setTimeout(() => {
            item.el.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            item.el.style.opacity = '1';
            item.el.style.transform = 'scale(1) translateY(0)';
          }, index * 15);
        } else {
          item.el.style.transition = 'none';
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
    }, animate ? 200 : 0); // Reduced delay to 200ms
  }

  // ─── Debounced Search Handler ───────────────────────────────────
  function handleSearchInput(e, isHero = false) {
    const val = e.target.value;
    currentQuery = val.trim().toLowerCase();
    updateInputs(val, currentFilter);
    if (!isHero) showSuggestions();

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFilters(true);
      if (isHero && val.length > 0) {
        const target = document.getElementById('products-explorer');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          if (mainSearch) setTimeout(() => mainSearch.focus(), 600); // Wait for scroll
        }
      }
    }, 300);
  }

  // ─── Custom Suggestions Logic ──────────────────────────────────
  const showSuggestions = () => {
    if (!suggestionsBox) return;
    const val = mainSearch.value.toLowerCase().trim();
    let hasVisible = false;

    suggestionItems.forEach(item => {
      const text = item.getAttribute('data-value').toLowerCase();
      const matches = text.includes(val);
      item.style.display = matches ? 'flex' : 'none';
      if (matches) hasVisible = true;
    });

    suggestionsBox.classList.toggle('is-hidden', !hasVisible);
  };

  // ─── Unified Event Listeners ──────────────────────────────────────────
  
  if (mainSearch) {
    mainSearch.addEventListener('input', (e) => handleSearchInput(e, false));
    mainSearch.addEventListener('focus', showSuggestions);
  }

  if (heroSearch) {
    heroSearch.addEventListener('input', (e) => handleSearchInput(e, true));
  }

  if (heroSelect) {
    heroSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value.toLowerCase().trim();
      updateInputs(currentQuery, currentFilter);
      applyFilters(true);
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      currentFilter = pill.dataset.filter.toLowerCase().trim();
      updateInputs(currentQuery, currentFilter);
      applyFilters(true);
    });
  });

  const tickerItems = document.querySelectorAll('[data-filter-ticker]');
  tickerItems.forEach(item => {
    item.addEventListener('click', () => {
      const filterValue = item.getAttribute('data-filter-ticker');
      const gridTop = document.getElementById('products-grid-top');
      if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
      
      currentFilter = filterValue;
      updateInputs(currentQuery, currentFilter);
      applyFilters(true);
    });
  });

  suggestionItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-value');
      currentQuery = val.toLowerCase();
      updateInputs(val, currentFilter);
      applyFilters(true);
      suggestionsBox.classList.add('is-hidden');
    });
  });

  document.addEventListener('click', (e) => {
    if (suggestionsBox && !mainSearch.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add('is-hidden');
    }
  });

  // ─── Horizontal Scroll ───
  const pillsContainer = document.getElementById('filter-pills-scroll');
  const scrollLeftBtn  = document.getElementById('pills-scroll-left');
  const scrollRightBtn = document.getElementById('pills-scroll-right');

  if (pillsContainer) {
    const updateArrows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = pillsContainer;
      const wrap = pillsContainer.parentElement;
      wrap.classList.toggle('has-scroll-left', scrollLeft > 10);
      wrap.classList.toggle('has-scroll-right', scrollLeft < scrollWidth - clientWidth - 10);
    };
    pillsContainer.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
    if (scrollLeftBtn) scrollLeftBtn.onclick = () => pillsContainer.scrollBy({ left: -300, behavior: 'smooth' });
    if (scrollRightBtn) scrollRightBtn.onclick = () => pillsContainer.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // Initial Load (Fast Stagger)
  setTimeout(() => applyFilters(true), 100);
}
