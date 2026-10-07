/**
 * GitHub Repository Archive & Live Search/Filter
 */

/* ==========================================================================
   8. REAL GITHUB REPOSITORY ARCHIVE & FILTERING
   ========================================================================== */
let allRepositories = [];

async function initRepoArchive() {
  const container = document.getElementById('repo-archive-grid');
  const searchInput = document.getElementById('repo-search-input');
  const filterPills = document.querySelectorAll('.repo-filter-btn');
  const countBadge = document.getElementById('repo-count-badge');

  if (!container) return;

  try {
    const res = await fetch('./data/repos.json');
    if (res.ok) {
      allRepositories = await res.json();
    }
  } catch (err) {
    console.warn('Local repos.json could not be loaded, using fallback sample:', err);
  }

  // If local load failed or empty, fallback to verified subset
  if (!allRepositories || allRepositories.length === 0) {
    allRepositories = [
      { name: 'pykasi', language: 'Python', description: 'Bahasa pemrograman berbasis Python dengan sintaks khas Bekasi', url: 'https://github.com/FARILtau72/pykasi' },
      { name: 'Qrcode', language: 'HTML', description: 'Sistem absensi berbasis QR code dan rekap data', url: 'https://github.com/FARILtau72/Qrcode' },
      { name: 'bultang-tb', language: 'Python', description: 'Aplikasi manajemen turnamen bulutangkis SMK Taruna Bangsa', url: 'https://github.com/FARILtau72/bultang-tb' },
      { name: 'eyed-2.0', language: 'HTML', description: 'Upgrade sistem absensi deteksi wajah berbasis web', url: 'https://github.com/FARILtau72/eyed-2.0' },
      { name: 'Fedxi', language: 'Python', description: 'Aplikasi Python untuk manipulasi dan pengeditan foto digital', url: 'https://github.com/FARILtau72/Fedxi' },
      { name: 'slideshow', language: 'HTML', description: 'TV Slideshow untuk informasi Rekayasa Perangkat Lunak', url: 'https://github.com/FARILtau72/slideshow' }
    ];
  }

  let activeCategory = 'all';

  function renderRepos() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    
    const filtered = allRepositories.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(query) || (r.description && r.description.toLowerCase().includes(query));
      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'python') return (r.language && r.language.toLowerCase() === 'python');
      if (activeCategory === 'web') return (r.language && (r.language.toLowerCase() === 'html' || r.language.toLowerCase() === 'javascript' || r.language.toLowerCase() === 'astro'));
      if (activeCategory === 'security') return (r.name.toLowerCase().includes('ctf') || r.name.toLowerCase().includes('osint') || r.name.toLowerCase().includes('sec') || (r.description && r.description.toLowerCase().includes('osint')));
      return true;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Repositories`;
    }

    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400 font-mono text-sm">
          No public repositories found matching your query.
        </div>
      `;
      return;
    }

    filtered.slice(0, 15).forEach(repo => {
      const card = document.createElement('div');
      card.className = 'clean-card p-5 flex flex-col justify-between group';
      
      const langColor = repo.language === 'Python' ? 'bg-amber-400' :
                        repo.language === 'JavaScript' ? 'bg-yellow-400' :
                        repo.language === 'HTML' ? 'bg-orange-500' :
                        repo.language === 'Astro' ? 'bg-purple-500' : 'bg-blue-500';

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700">
              <span class="w-2 h-2 rounded-full ${langColor}"></span>
              ${repo.language || 'Code'}
            </span>
            <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-blue-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
          <h4 class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 text-base font-mono">
            ${repo.name}
          </h4>
          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            ${repo.description || 'Public experiment & software development project.'}
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>FARILtau72</span>
          <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-semibold flex items-center gap-1">
            GitHub ↗
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderRepos);
  }

  filterPills.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPills.forEach(b => b.classList.remove('bg-slate-900', 'text-white', 'border-slate-900'));
      btn.classList.add('bg-slate-900', 'text-white', 'border-slate-900');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      renderRepos();
    });
  });

  renderRepos();
}
