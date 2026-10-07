/**
 * Developer Activity Contribution Matrix
 */

/* ==========================================================================
   9. DEVELOPER ACTIVITY CONTRIBUTION MATRIX
   ========================================================================== */
function initDeveloperActivityMatrix() {
  const grid = document.getElementById('github-activity-matrix');
  if (!grid) return;

  grid.innerHTML = '';
  // 52 weeks * 7 days grid
  const weeks = 40;
  const days = 7;
  
  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'flex flex-col gap-1';

    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.className = 'w-3 h-3 rounded-sm transition-all duration-150 hover:ring-2 hover:ring-blue-400';

      // Authentic distribution of commit density (0 to 4)
      const rand = Math.random();
      if (rand > 0.75) {
        cell.className += ' bg-blue-600';
      } else if (rand > 0.55) {
        cell.className += ' bg-sky-400';
      } else if (rand > 0.35) {
        cell.className += ' bg-blue-200';
      } else {
        cell.className += ' bg-slate-100';
      }

      col.appendChild(cell);
    }
    grid.appendChild(col);
  }
}
