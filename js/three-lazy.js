/**
 * Lazy Three.js Scene Loader
 */

/* ==========================================================================
   3. THREE.JS LAZY INITIALIZATION
   ========================================================================== */
function initThreeCoreLazy() {
  // Wait until idle or slightly delayed so critical rendering isn't delayed
  const startThree = () => {
    import('./three-core.js')
      .then(({ DeveloperOrb }) => {
        new DeveloperOrb('hero-three-container');
      })
      .catch(err => {
        console.warn('Three.js initialization skipped/failed:', err);
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => startThree(), { timeout: 1200 });
  } else {
    setTimeout(startThree, 300);
  }
}
