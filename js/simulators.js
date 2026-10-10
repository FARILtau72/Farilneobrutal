/**
 * Interactive Project Simulators:
 * - PyKasi (Bekasi Slang Language)
 * - QR Attendance System
 * - TV Slideshow RPL
 */

/* ==========================================================================
   5. PYKASI SYNTAX SIMULATOR (Bekasi Slang Language)
   ========================================================================== */
function initPykasiSimulator() {
  const codeSelect = document.getElementById('pykasi-sample-select');
  const codeDisplay = document.getElementById('pykasi-code-display');
  const runBtn = document.getElementById('pykasi-run-btn');
  const outputDisplay = document.getElementById('pykasi-terminal-output');

  if (!codeSelect || !codeDisplay || !runBtn || !outputDisplay) return;

  const samples = {
    hello: {
      code: `// PyKasi 0.1 - Syntax Bekasi Asli\nbocah nama = "Faril Putra Pratama"\nbocah kota = "Bekasi"\n\ncetak("Halo bray! Kenalin nama gua: " + nama)\ncetak("Asal dari: " + kota)\ncetak("Status: Mahir Python & PLY Lexer")`,
      output: `[PYKASI INTERPRETER v1.0.2]\n> Parsing tokens with PLY (Lex-Yacc)...\n> AST validated.\n\nHalo bray! Kenalin nama gua: Faril Putra Pratama\nAsal dari: Bekasi\nStatus: Mahir Python & PLY Lexer\n\n[Selesai nyante tanpa error: Exit Code 0]`
    },
    loop: {
      code: `// Perulangan khas Bekasi\nbocah kopi = 3\n\nmuter kopi > 0 {\n    cetak("Sruput kopi lu slur! Sisa: " + kopi)\n    kopi = kopi - 1\n}\ncetak("Kopi abis, gaskeun ngoding sistem!")`,
      output: `[PYKASI INTERPRETER v1.0.2]\n> Executing while-loop AST node...\n\nSruput kopi lu slur! Sisa: 3\nSruput kopi lu slur! Sisa: 2\nSruput kopi lu slur! Sisa: 1\nKopi abis, gaskeun ngoding sistem!\n\n[Selesai nyante tanpa error: Exit Code 0]`
    },
    condition: {
      code: `// Logika Percabangan Kalem\nbocah skill = "FastAPI"\n\nkalo skill == "FastAPI" {\n    cetak("Bikin backend kenceng parah!")\n} laennya {\n    cetak("Gaskeun belajar lagi tong!")\n}`,
      output: `[PYKASI INTERPRETER v1.0.2]\n> Evaluating branch condition...\n\nBikin backend kenceng parah!\n\n[Selesai nyante tanpa error: Exit Code 0]`
    }
  };

  codeSelect.addEventListener('change', () => {
    const val = codeSelect.value;
    if (samples[val]) {
      codeDisplay.textContent = samples[val].code;
      outputDisplay.textContent = '// Klik "Jalankan Kode" untuk mengeksekusi...';
    }
  });

  runBtn.addEventListener('click', () => {
    outputDisplay.textContent = '> Mengompilasi kode PyKasi dengan Lexer & Parser...';
    setTimeout(() => {
      const val = codeSelect.value;
      if (samples[val]) {
        outputDisplay.textContent = samples[val].output;
      }
    }, 350);
  });
}

/* ==========================================================================
   6. QR ATTENDANCE SYSTEM SIMULATOR
   ========================================================================== */
function initQrAttendanceSimulator() {
  const scanBtn = document.getElementById('qr-scan-trigger');
  const statusBadge = document.getElementById('qr-scan-status');
  const tableBody = document.getElementById('qr-log-tbody');

  if (!scanBtn || !statusBadge || !tableBody) return;

  const mockStudents = [
    { nis: '2026101', name: 'Faril Putra Pratama', class: 'XII RPL 1', status: 'Hadir Tepat Waktu' },
    { nis: '2026102', name: 'Ahmad Faisal', class: 'XII RPL 1', status: 'Hadir' },
    { nis: '2026103', name: 'Nabila Rahma', class: 'XII RPL 2', status: 'Hadir' },
    { nis: '2026104', name: 'Rizky Alamsyah', class: 'XII RPL 1', status: 'Hadir' }
  ];

  let studentIdx = 0;

  scanBtn.addEventListener('click', () => {
    statusBadge.textContent = 'Scanning QR Code...';
    statusBadge.className = 'text-xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800';

    setTimeout(() => {
      const student = mockStudents[studentIdx % mockStudents.length];
      studentIdx++;
      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      statusBadge.textContent = `Verified: ${student.name}`;
      statusBadge.className = 'text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800';

      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors animate-fade-in';
      tr.innerHTML = `
        <td class="py-2.5 px-3 font-mono text-xs text-slate-500">${time}</td>
        <td class="py-2.5 px-3 font-semibold text-slate-800 text-xs">${student.name}</td>
        <td class="py-2.5 px-3 text-xs text-slate-500">${student.class}</td>
        <td class="py-2.5 px-3 text-right">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            ${student.status}
          </span>
        </td>
      `;

      tableBody.insertBefore(tr, tableBody.firstChild);

      // Keep maximum 5 rows visible in preview
      if (tableBody.children.length > 5) {
        tableBody.removeChild(tableBody.lastChild);
      }
    }, 450);
  });
}

/* ==========================================================================
   7. TV SLIDESHOW RPL SIMULATOR
   ========================================================================== */
function initTvSlideshowSimulator() {
  const slides = document.querySelectorAll('.tv-slide-item');
  const prevBtn = document.getElementById('tv-slide-prev');
  const nextBtn = document.getElementById('tv-slide-next');
  const indicator = document.getElementById('tv-slide-indicator');

  if (!slides.length || !prevBtn || !nextBtn) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.toggle('hidden', idx !== index);
    });
    if (indicator) {
      indicator.textContent = `Slide ${index + 1} of ${slides.length}`;
    }
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  showSlide(0);
}
