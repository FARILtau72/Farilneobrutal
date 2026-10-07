/**
 * Certificate Lightbox Modal Controller
 */

/* ==========================================================================
   11. CERTIFICATE LIGHTBOX MODAL
   ========================================================================== */
window.openCertModal = function(imageSrc, title) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('cert-modal-img');
  const modalTitle = document.getElementById('cert-modal-title');
  if (!modal || !modalImg) return;

  modalImg.src = imageSrc;
  if (modalTitle && title) modalTitle.textContent = title;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

window.closeCertModal = function() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
};

// Close modal on click outside content or on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCertModal();
  }
});

const certModal = document.getElementById('cert-modal');
if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
      window.closeCertModal();
    }
  });
}
