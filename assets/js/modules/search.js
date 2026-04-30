/**
 * Global Search Module - Professional Medical Spotlight
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
      // Robust root fetch with cache buster
      const response = await fetch('/index.json?nocache=' + Date.now());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      searchIndex = await response.json();
      
      fuse = new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 1.0 },
          { name: 'summary', weight: 0.5 }
        ],
        threshold: 0.4,
        minMatchCharLength: 1
      });
    } catch (err) {
      console.error('Search Init Error:', err);
    }
  }

  function openSpotlight() {
    spotlight.classList.add('is-active');
    document.body.classList.add('search-open');
    if (window.lenis) window.lenis.stop();
    setTimeout(() => input.focus(), 150);
    loadIndex();
  }

  function closeSpotlight() {
    spotlight.classList.remove('is-active');
    document.body.classList.remove('search-open');
    if (window.lenis) window.lenis.start();
    input.value = '';
    resetResults();
  }

  function resetResults() {
    resultsArea.innerHTML = `
      <div class="search-placeholder">
        <i data-lucide="sparkles" class="icon"></i>
        <p>Find products or pages...</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    openSpotlight();
  });

  close.addEventListener('click', closeSpotlight);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spotlight.classList.contains('is-active')) closeSpotlight();
  });

  spotlight.addEventListener('click', (e) => {
    if (e.target === spotlight) closeSpotlight();
  });

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 1) {
      resetResults();
      return;
    }
    if (!fuse) return;

    let results = fuse.search(query).map(r => r.item);
    results.sort((a, b) => a.weight - b.weight);

    renderResults(results);
  });

  function getIconForType(type) {
    const t = type.toLowerCase();
    if (t.includes('range')) return 'package';
    if (t.includes('unit')) return 'factory';
    if (t.includes('faq')) return 'help-circle';
    if (t.includes('category')) return 'layers';
    return 'file-text';
  }

  function renderResults(results) {
    if (results.length === 0) {
      resultsArea.innerHTML = `<div class="search-no-results"><p>No results found for "${input.value}"</p></div>`;
      return;
    }

    resultsArea.innerHTML = results.map(item => `
      <a href="${item.permalink}" class="search-result-item">
        <div class="result-icon">
          <i data-lucide="${getIconForType(item.type)}" class="icon"></i>
        </div>
        <div class="result-content">
          <div class="result-meta"><span>${item.type}</span></div>
          <div class="result-title">${item.title}</div>
          <div class="result-summary">${item.summary || ''}</div>
        </div>
      </a>
    `).join('');
    
    if (window.lucide) window.lucide.createIcons();
  }
}
