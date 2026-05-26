/**
 * Saar Biotech — Products Module (Elite Search & Sync)
 * Handles: dual-search sync, ticker clicks, custom autocomplete, and scored filtering
 */
export function initProducts() {
  const page = document.getElementById('products-page');
  if (!page) return;

  const grid = document.getElementById('products-grid');
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const mainSearch = document.getElementById('products-search');
  const heroSearch = document.getElementById('hero-search');
  const heroSelect = document.getElementById('hero-cat-select');
  const suggestionsBox = document.getElementById('search-suggestions');
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  const tickerItems = document.querySelectorAll('[data-filter-ticker]');

  const cardWraps = Array.from(document.querySelectorAll('.product-card-wrap'));
  const countEl = document.getElementById('products-count');
  const activeLabel = document.getElementById('products-active-label');
  const emptyState = document.getElementById('products-empty');
  const showMoreContainer = document.getElementById('products-show-more');
  const showMoreBtn = document.getElementById('show-more-btn');

  // Horizontal Scroll Elements
  const pillsContainer = document.getElementById('filter-pills-scroll');
  const scrollLeftBtn = document.getElementById('pills-scroll-left');
  const scrollRightBtn = document.getElementById('pills-scroll-right');

  if (!cardWraps.length) return;

  let currentFilter = 'all';
  let currentQuery = '';
  let isExpanded = false;
  let searchTimeout = null;

  // ─── Pre-Index Data ────────────────────────────────────────────
  const productData = cardWraps.map(el => ({
    el: el,
    categorySlugs: (el.dataset.categorySlugs || '').toLowerCase(),
    categories: (el.dataset.categories || '').toLowerCase(),
    title: (el.dataset.title || '').toLowerCase(),
    comp: (el.dataset.composition || '').toLowerCase(),
    area: (el.dataset.area || '').toLowerCase(),
    tclass: (el.dataset.therapeuticClass || '').toLowerCase(),
    tarea: (el.dataset.therapeuticArea || '').toLowerCase(),
    dform: (el.dataset.drugForm || '').toLowerCase(),
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

    productData.forEach(item => {
      const itemCats = item.categorySlugs.split(' ').filter(Boolean);
      const passesCategory = (currentFilter === 'all') || itemCats.includes(currentFilter);

      let score = 0;
      if (currentQuery) {
        if (item.title.includes(currentQuery)) score += 2000;
        if (item.categories.includes(currentQuery)) score += 1500;
        if (item.desc.includes(currentQuery)) score += 500;
        if (item.comp.includes(currentQuery)) score += 250;
        if (item.dform.includes(currentQuery)) score += 220;
        if (item.tclass.includes(currentQuery)) score += 200;
        if (item.tarea.includes(currentQuery)) score += 180;
        if (item.area.includes(currentQuery)) score += 100;
        if (item.packs.includes(currentQuery)) score += 50;
      } else {
        score = 1;
      }

      const isMatch = passesCategory && score > 0;
      if (isMatch) {
        matches.push({ item, score });
        visibleCount++;
      } else {
        item.el.style.transition = 'all 0.3s ease-out';
        item.el.style.opacity = '0';
        item.el.style.transform = 'scale(0.9) translateY(20px)';
      }
    });

    setTimeout(() => {
      let shownInGrid = 0;
      const MAX_INITIAL = 12;

      productData.forEach(item => {
        const itemCats = item.categorySlugs.split(' ').filter(Boolean);
        const matchData = matches.find(m => m.item === item);
        const isMatch = (currentFilter === 'all' || itemCats.includes(currentFilter)) &&
          (!currentQuery || !!matchData);
        
        // Handle "Show More" visibility
        let shouldHideForPagination = false;
        if (isMatch && !isExpanded) {
          // Find index in matches array to see if it's beyond the limit
          const matchIndex = matches.findIndex(m => m.item === item);
          if (matchIndex >= MAX_INITIAL) {
            shouldHideForPagination = true;
          } else {
            shownInGrid++;
          }
        } else if (isMatch) {
          shownInGrid++;
        }

        item.el.classList.toggle('is-hidden', !isMatch || shouldHideForPagination);
      });

      // Show/Hide "Show More" Button
      if (showMoreContainer) {
        showMoreContainer.style.display = (visibleCount > MAX_INITIAL && !isExpanded) ? 'flex' : 'none';
      }

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
    
    // Only show suggestions when there is active typed content. If empty or cleared, hide suggestions completely.
    if (val === '') {
      suggestionsBox.classList.add('is-hidden');
      return;
    }
    
    let hasVisibleTotal = false;
    const groups = suggestionsBox.querySelectorAll('.suggestions-group');

    if (groups.length > 0) {
      groups.forEach(group => {
        let hasVisibleInGroup = false;
        const items = group.querySelectorAll('.suggestion-item');
        items.forEach(item => {
          const text = item.getAttribute('data-value').toLowerCase();
          const matches = text.includes(val);
          item.style.display = matches ? 'flex' : 'none';
          if (matches) {
            hasVisibleInGroup = true;
            hasVisibleTotal = true;
          }
        });
        // Dynamically show/hide the entire group (including header) based on matching items
        group.style.display = hasVisibleInGroup ? 'block' : 'none';
      });
    } else {
      // Fallback if suggestions are not grouped
      suggestionItems.forEach(item => {
        const text = item.getAttribute('data-value').toLowerCase();
        const matches = text.includes(val);
        item.style.display = matches ? 'flex' : 'none';
        if (matches) hasVisibleTotal = true;
      });
    }

    suggestionsBox.classList.toggle('is-hidden', !hasVisibleTotal);
  };

  // ─── Unified Event Listeners ──────────────────────────────────────────

  if (mainSearch) {
    mainSearch.addEventListener('input', (e) => handleSearchInput(e, false));
    mainSearch.addEventListener('focus', showSuggestions);

    // Mobile dismissal on Enter
    mainSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const gridTop = document.getElementById('products-grid-top');
        if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
        mainSearch.blur();
        if (suggestionsBox) suggestionsBox.classList.add('is-hidden');
      }
    });
  }

  if (heroSearch) {
    heroSearch.addEventListener('input', (e) => handleSearchInput(e, true));

    heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const gridTop = document.getElementById('products-grid-top');
        if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
        heroSearch.blur();
      }
    });
  }

  if (heroSelect) {
    const customDropdown = document.getElementById('hero-cat-custom-dropdown');
    const trigger = document.getElementById('hero-cat-trigger');
    const triggerText = trigger?.querySelector('.hero-cat-selected-text');
    const list = document.getElementById('hero-cat-list');
    const options = list?.querySelectorAll('.hero-cat-option');

    const toggleDropdown = (e) => {
      e.stopPropagation();
      customDropdown?.classList.toggle('is-active');
    };

    const closeDropdown = () => {
      customDropdown?.classList.remove('is-active');
    };

    trigger?.addEventListener('click', toggleDropdown);

    options?.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-value');
        const text = opt.textContent;

        // Update selection state
        options.forEach(o => o.classList.remove('is-active'));
        opt.classList.add('is-active');

        // Update trigger text
        if (triggerText) triggerText.textContent = text;

        // Sync with hidden native select and trigger change
        heroSelect.value = val;
        heroSelect.dispatchEvent(new Event('change'));

        closeDropdown();
      });
    });

    document.addEventListener('click', (e) => {
      if (customDropdown && !customDropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    heroSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value.toLowerCase().trim();
      updateInputs(currentQuery, currentFilter);
      applyFilters(true);

      // Also update custom dropdown text if changed from elsewhere (e.g. pills)
      const selectedOption = Array.from(options || []).find(o => o.getAttribute('data-value') === currentFilter);
      if (selectedOption && triggerText) {
        triggerText.textContent = selectedOption.textContent;
        options?.forEach(o => o.classList.toggle('is-active', o === selectedOption));
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      currentFilter = pill.dataset.filter.toLowerCase().trim();
      updateInputs(currentQuery, currentFilter);
      applyFilters(true);
    });
  });

  tickerItems.forEach(item => {
    item.addEventListener('click', () => {
      currentFilter = item.getAttribute('data-filter-ticker').toLowerCase().trim();
      const gridTop = document.getElementById('products-grid-top');
      if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
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
      if (suggestionsBox) suggestionsBox.classList.add('is-hidden');
    });
  });

  document.addEventListener('click', (e) => {
    if (suggestionsBox && !mainSearch.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add('is-hidden');
    }
  });

  // ─── Horizontal Scroll UI Logic ───
  if (pillsContainer) {
    if (scrollLeftBtn) scrollLeftBtn.onclick = () => pillsContainer.scrollBy({ left: -300, behavior: 'smooth' });
    if (scrollRightBtn) scrollRightBtn.onclick = () => pillsContainer.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // ─── Show More Click ───
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      isExpanded = true;
      applyFilters(true);
      // Smooth scroll a bit to show newly revealed items
      setTimeout(() => {
        const firstHidden = document.querySelector('.product-card-wrap:not(.is-hidden)');
        // (Optional) Scroll logic here if needed
      }, 300);
    });
  }

  // ─── sessionStorage Pre-Filter (from /products/categories/ hub) ───────────
  // When a user clicks "Browse Products" on a therapeutic area card, we store
  // a filter slug in sessionStorage BEFORE navigating (no URL change).
  // This is read here, applied once, and immediately cleared.
  // Google NEVER sees any query param or different URL — /products/ stays clean.
  const preFilter = sessionStorage.getItem('productsPreFilter');
  if (preFilter) {
    sessionStorage.removeItem('productsPreFilter'); // one-shot: clear immediately
    const normalizedFilter = preFilter.toLowerCase().trim();
    // Find matching pill by data-filter attribute
    const matchingPill = Array.from(filterPills).find(
      p => p.dataset.filter.toLowerCase().trim() === normalizedFilter
    );
    if (matchingPill) {
      currentFilter = normalizedFilter;
      updateInputs(currentQuery, currentFilter);
      // Scroll the active pill into view in the horizontal strip
      setTimeout(() => {
        matchingPill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        // Also scroll page down to the product grid for better UX
        const gridTop = document.getElementById('products-grid-top');
        if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      // Slug didn't match a pill exactly — use as a text search query instead
      currentQuery = preFilter.toLowerCase().trim();
      updateInputs(currentQuery, 'all');
    }
  }

  // Initial Load (Fast Stagger)
  setTimeout(() => applyFilters(true), 100);
}
