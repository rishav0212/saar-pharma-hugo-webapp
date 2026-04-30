/**
 * Global Search Module - Spotlight version
 */
export function initSearch() {
  const spotlight = document.getElementById('search-spotlight');
  const toggle = document.getElementById('search-toggle');
  const close = document.getElementById('search-close');
  const input = document.getElementById('search-input');
  const resultsArea = document.getElementById('search-results');

  if (!spotlight || !toggle) return;

  let searchIndex = null;
  let fuse = null;

  async function loadIndex() {
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
      console.error('Search Load Error:', err);
    }
  }

  function openSpotlight() {
    spotlight.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 100);
    loadIndex();
  }

  function closeSpotlight() {
    spotlight.classList.remove('is-active');
    document.body.style.overflow = '';
    input.value = '';
    resetResults();
  }

  function resetResults() {
    resultsArea.innerHTML = `
      <div class="search-placeholder">
        <i data-lucide="sparkles" class="icon"></i>
        <p>Search across the entire site</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    openSpotlight();
  });

  close.addEventListener('click', closeSpotlight);

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spotlight.classList.contains('is-active')) {
      closeSpotlight();
    }
  });

  // Close on click outside the inner panel
  spotlight.addEventListener('click', (e) => {
    if (e.target === spotlight) closeSpotlight();
  });

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      resetResults();
      return;
    }
    if (!fuse) return;
    renderResults(fuse.search(query));
  });

  function renderResults(results) {
    if (results.length === 0) {
      resultsArea.innerHTML = `
        <div class="search-no-results">
          <p>No results found for your search</p>
        </div>
      `;
      return;
    }

    resultsArea.innerHTML = results.map(result => {
      const item = result.item;
      return `
        <a href="${item.permalink}" class="search-result-item">
          <div class="result-meta"><span>${item.type || 'Page'}</span></div>
          <div class="result-title">${item.title}</div>
          <div class="result-summary">${item.summary || ''}</div>
        </a>
      `;
    }).join('');
  }
}
