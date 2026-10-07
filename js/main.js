/**
 * Faril Putra Pratama Portfolio — Orchestrator & Entry Point
 * Architecture: Modular Clean Architecture
 * Modules:
 *  - theme.js        : Dark / Light Mode Switcher & Persistence
 *  - i18n.js         : English / Indonesian Translation Controller
 *  - cursor.js       : Custom Desktop Precision Cursor
 *  - navigation.js   : Scroll Spy & Navbar Microinteractions
 *  - three-lazy.js   : Three.js Interactive 3D Canvas Loader
 *  - simulators.js   : Aeterna AI, PyKasi, QR Attendance, TV Slideshow
 *  - archive.js      : Real GitHub Repositories (64 Repos) Filter & Search
 *  - metrics.js      : Developer Activity Matrix & GitHub Graph
 *  - cli.js          : Interactive Embedded Terminal ($ faril --cli)
 *  - modal.js        : High-Res Certificate Viewer & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme & Internationalization (Init First for Seamless UX)
  if (typeof initThemeToggle === 'function') initThemeToggle();
  if (typeof initLanguageToggle === 'function') initLanguageToggle();

  // UX & Navigation
  if (typeof initCustomCursor === 'function') initCustomCursor();
  if (typeof initNavbarScrollSpy === 'function') initNavbarScrollSpy();

  // Interactive Simulators & Dynamic Content
  if (typeof initThreeCoreLazy === 'function') initThreeCoreLazy();
  if (typeof initAeternaSimulator === 'function') initAeternaSimulator();
  if (typeof initPykasiSimulator === 'function') initPykasiSimulator();
  if (typeof initQrAttendanceSimulator === 'function') initQrAttendanceSimulator();
  if (typeof initTvSlideshowSimulator === 'function') initTvSlideshowSimulator();

  // Data & Repository Engine
  if (typeof initRepoArchive === 'function') initRepoArchive();
  if (typeof initDeveloperActivityMatrix === 'function') initDeveloperActivityMatrix();

  // Developer CLI & Modal
  if (typeof initCliDrawer === 'function') initCliDrawer();
  if (typeof initCertificateModal === 'function') initCertificateModal();
});
