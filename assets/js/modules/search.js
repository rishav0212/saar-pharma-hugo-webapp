/**
 * Global Search Module - Professional Medical Spotlight
 */
export function initSearch() {
  console.log('Saar Search: Initializing...');
  
  const spotlight = document.getElementById('search-spotlight');
  const toggle = document.getElementById('search-toggle');
  const close = document.getElementById('search-close');
  const input = document.getElementById('search-input');
  const resultsArea = document.getElementById('search-results');

  if (!spotlight || !toggle) {
    console.warn('Saar Search: Missing UI elements');
    return;
  }

  let searchIndex = null;
  let fuseEngine = null;
  let isFetching = false;

  async function loadIndex() {
    if (searchIndex || isFetching) return;
    isFetching = true;
    
    console.log('Saar Search: Loading index...');
    try {
      const paths = ['/index.json', './index.json', 'index.json'];
      let response = null;
      
      for (const path of paths) {
        try {
          console.log(`Saar Search: Trying ${path}...`);
          // Add a 5-second timeout to each fetch attempt
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          response = await fetch(path, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            console.log(`Saar Search: Success from ${path}`);
            break;
          }
        } catch (e) {
          console.warn(`Saar Search: Failed ${path}`, e.message);
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Data not found (Status: ${response ? response.status : 'None'})`);
      }
      
      searchIndex = await response.json();
      console.log('Saar Search: Index parsed, items:', searchIndex.length);
      
      const Fuse = window.Fuse;
      if (!Fuse) throw new Error('Fuse.js not found');

      fuseEngine = new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 1.0 },
          { name: 'summary', weight: 0.5 }
        ],
        threshold: 0.4,
        minMatchCharLength: 1
      });
      console.log('Saar Search: Engine Ready.');
    } catch (err) {
      console.error('Saar Search Fatal:', err);
      resultsArea.innerHTML = `<div class="search-no-results"><p>Error: ${err.message}. Try refreshing.</p></div>`;
    } finally {
      isFetching = false;
    }
  }

  function openSpotlight() {
    console.log('Saar Search: Opening spotlight');
    spotlight.classList.add('is-active');
    spotlight.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-open');
    
    // Safety check for Lenis instance and stop method
    if (window.lenis && typeof window.lenis.stop === 'function') {
      window.lenis.stop();
    }
    
    setTimeout(() => input.focus(), 150);
    loadIndex();
  }

  function closeSpotlight() {
    spotlight.classList.remove('is-active');
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-open');
    
    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }
    
    input.value = '';
    resetResults();
  }

  function resetResults() {
    if (!resultsArea) return;
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

  // Close spotlight when a result is clicked
  resultsArea.addEventListener('click', (e) => {
    const link = e.target.closest('.search-result-item');
    if (link) {
      // Small delay to ensure the click interaction is registered before UI disappears
      setTimeout(closeSpotlight, 10);
    }
  });

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 1) {
      resetResults();
      return;
    }
    if (!fuseEngine) {
      console.warn('Saar Search: Engine not ready yet');
      return;
    }

    let results = fuseEngine.search(query).map(r => r.item);
    results.sort((a, b) => a.weight - b.weight);

    renderResults(results);
  });

  function getIconForType(type) {
    const t = type ? type.toLowerCase() : 'page';
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
          ${item.content ? `<div class="result-snippet">${item.content.substring(0, 100)}...</div>` : ''}
        </div>
      </a>
    `).join('');
    
    if (window.lucide) window.lucide.createIcons();
  }
}
