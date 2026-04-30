/**
 * Global Search Module - Header Dropdown version
 */
export function initSearch() {
  const searchContainer = document.getElementById('search-container');
  const searchToggle = document.getElementById('search-toggle');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchContainer || !searchToggle) return;

  let searchIndex = null;
  let fuse = null;

  // ─── Initialize Fuse.js ───
  async function loadSearchIndex() {
    if (searchIndex) return;
    try {
      const response = await fetch('/index.json');
      searchIndex = await response.json();
      fuse = new Fuse(searchIndex, {
        keys: ['title', 'summary', 'content', 'type'],
        threshold: 0.3,
        includeMatches: true,
        minMatchCharLength: 2
      });
    } catch (err) {
      console.error('Search Index Error:', err);
    }
  }

  // ─── Search Bar Controls ───
  function toggleSearch() {
    const isActive = searchContainer.classList.toggle('is-active');
    if (isActive) {
      searchInput.focus();
      loadSearchIndex();
    } else {
      searchInput.value = '';
      resetResults();
    }
  }

  function closeSearch() {
    searchContainer.classList.remove('is-active');
    searchInput.value = '';
    resetResults();
  }

  function resetResults() {
    searchResults.innerHTML = `
      <div class="search-placeholder">
        <i data-lucide="sparkles" class="icon"></i>
        <p>Search across the entire site</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  searchToggle.addEventListener('click', toggleSearch);
  searchClose.addEventListener('click', closeSearch);

  // Close on Outside Click
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      closeSearch();
    }
  });

  // ─── Search Logic ───
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      resetResults();
      return;
    }

    if (!fuse) return;
    const results = fuse.search(query);
    renderResults(results);
  });

  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <i data-lucide="frown" class="icon"></i>
          <p>No results found</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const html = `
      <div class="search-dropdown-results">
        ${results.map(result => {
          const item = result.item;
          return `
            <a href="${item.permalink}" class="search-result-item">
              <div class="result-meta"><span>${item.type || 'Page'}</span></div>
              <div class="result-title">${item.title}</div>
              <div class="result-summary">${item.summary || ''}</div>
            </a>
          `;
        }).join('')}
      </div>
    `;

    searchResults.innerHTML = html;
  }
}
