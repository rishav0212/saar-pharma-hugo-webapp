/**
 * Global Search Module using Fuse.js
 */
export function initSearch() {
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchToggle || !searchModal) return;

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
      console.error('Failed to load search index:', err);
    }
  }

  // ─── Modal Controls ───
  function openSearch() {
    searchModal.classList.add('is-active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
    loadSearchIndex();
  }

  function closeSearch() {
    searchModal.classList.remove('is-active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  searchClose.addEventListener('click', closeSearch);

  // Close on Escape or Backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('is-active')) {
      closeSearch();
    }
  });

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  // ─── Search Logic ───
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      searchResults.innerHTML = `
        <div class="search-placeholder">
          <i data-lucide="sparkles" class="icon"></i>
          <p>Enter keywords to search across the entire site</p>
        </div>
      `;
      lucide.createIcons();
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
          <p>No results found for your search</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const html = results.map(result => {
      const item = result.item;
      return `
        <a href="${item.permalink}" class="search-result-item">
          <div class="result-meta">
            <span>${item.type || 'Page'}</span>
          </div>
          <div class="result-title">${item.title}</div>
          <div class="result-summary">${item.summary || ''}</div>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;
  }
}
