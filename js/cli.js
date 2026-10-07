/**
 * Interactive CLI Terminal Drawer
 */

/* ==========================================================================
   10. INTERACTIVE CLI DRAWER ($ faril --cli)
   ========================================================================== */
function initCliDrawer() {
  const drawer = document.getElementById('cli-drawer');
  const triggerBtn = document.getElementById('cli-trigger-btn');
  const closeBtn = document.getElementById('cli-close-btn');
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');

  if (!drawer || !input || !output) return;

  function toggleCli() {
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      input.focus();
    }
  }

  if (triggerBtn) triggerBtn.addEventListener('click', toggleCli);
  if (closeBtn) closeBtn.addEventListener('click', toggleCli);

  // Keyboard shortcut Ctrl+/ to toggle CLI
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      toggleCli();
    } else if (e.key === 'Escape' && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      input.value = '';
      if (!val) return;

      appendOutput(`$ ${val}`, 'text-cyan-400 font-semibold');

      switch (val) {
        case 'help':
          appendOutput(`Available commands:
  - about       : Faril's background & positioning
  - projects    : Core projects & hackathon entries
  - skills      : Current technical stack & toolbox
  - experience  : Real roles & operational work
  - awards      : Verifiable honors & scholarships
  - contact     : Email and verified handles
  - clear       : Clear the console
  - exit        : Close CLI drawer`);
          break;

        case 'about':
          appendOutput(`Faril Putra Pratama (FARILtau72)
Location: Bekasi, Indonesia
Student @ SMKS Taruna Bangsa (Rekayasa Perangkat Lunak)
Focus: Python, Backend Engineering, AI & Smart Systems.`);
          break;

        case 'projects':
          appendOutput(`Featured Work:
1. AETERNA AI   - Waste Generation Forecasting (Chronos T5, FastAPI)
2. PyKasi       - Bekasi Slang Language (Python PLY Lexer/Parser)
3. QR Attendance- Student Management & QR Scanner (Flask, TiDB)
4. TV Slideshow - Digital Signage for SMKS Taruna Bangsa`);
          break;

        case 'skills':
          appendOutput(`Languages : Python, JavaScript, HTML, CSS
Backend   : FastAPI, Flask, REST APIs
AI / Data : Scikit-learn, Pandas, Machine Learning
Databases : MariaDB, MongoDB, TiDB, MySQL, SQLite
Tools     : Git, GitHub, Postman, Vercel, Google Cloud`);
          break;

        case 'experience':
          appendOutput(`Experience Timeline:
- CV Mandiri Utama : System Developer & Inventory Specialist (2026-Present)
- Unit Produksi RPL: Developer / Member @ SMKS Taruna Bangsa (2025-Present)
- Cosmic Security  : Volunteer Staff / Community Contributor (2026-Present)`);
          break;

        case 'awards':
          appendOutput(`Verified Honors:
- 🥉 3rd Place - Hacktivate 2026 (AETERNA AI)
- Finalist - AI Open Innovation Challenge 2026
- Top #2 HTML Developer in Bekasi (Stardev)
- 100% Scholarship Recipient @ CodeLamp (Score 97.5)`);
          break;

        case 'contact':
          appendOutput(`Reach Out:
- Email   : farilpratamap@gmail.com
- GitHub  : https://github.com/FARILtau72
- LinkedIn: https://www.linkedin.com/in/faril-putra-pratama-81561a280
- Location: Bekasi, Indonesia`);
          break;

        case 'clear':
          output.innerHTML = '';
          return;

        case 'exit':
          drawer.classList.remove('active');
          return;

        case 'sudo':
          appendOutput('Permission denied: You are a guest in Faril\'s digital laboratory :)');
          break;

        default:
          appendOutput(`Command not found: "${val}". Type "help" for a list of available commands.`, 'text-rose-400');
          break;
      }

      output.scrollTop = output.scrollHeight;
    }
  });

  function appendOutput(text, cssClass = 'text-slate-300') {
    const div = document.createElement('div');
    div.className = `whitespace-pre-wrap my-1 font-mono text-xs ${cssClass}`;
    div.textContent = text;
    output.appendChild(div);
  }
}
