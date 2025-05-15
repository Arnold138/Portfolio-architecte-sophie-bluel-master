// modal.js - Gère la modale de modification + suppression
import { travaux, afficherTravauxMain } from './travaux.js';

const token = sessionStorage.getItem('token');

export function setupModalEvents() {
  const btnOpen = document.getElementById('openModalBtn');
  const btnClose = document.querySelector('.modal-content .close');
  const btnAjouter = document.querySelector('.btn-ajouter');
  const btnBack = document.querySelector('.back-arrow');
  const viewList = document.querySelector('.view--list');
  const viewForm = document.querySelector('.view--form');

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnAjouter) btnAjouter.addEventListener('click', () => {
    viewList.classList.add('hidden');
    viewForm.classList.remove('hidden');
  });
  if (btnBack) btnBack.addEventListener('click', () => {
    viewForm.classList.add('hidden');
    viewList.classList.remove('hidden');
    resetFormulaireModal();
  });
}

export function openModal() {
  document.getElementById('modal-modif').classList.remove('hidden');
  afficherTravauxModal(travaux);
}

export function closeModal() {
  document.getElementById('modal-modif').classList.add('hidden');
  resetFormulaireModal();
}

function afficherTravauxModal(travaux) {
  const container = document.querySelector('.projects-container');
  if (!container) return;
  container.innerHTML = '';
  travaux.forEach((travail) => {
    const item = document.createElement('div');
    item.classList.add('project-item');
    const img = document.createElement('img');
    img.src = travail.imageUrl;
    img.alt = travail.title;
    const del = document.createElement('span');
    del.classList.add('delete-icon');
    const icon = document.createElement('img');
    icon.src = 'assets/icons/Vectorrr.png';
    icon.alt = 'Supprimer';
    del.appendChild(icon);
    del.addEventListener('click', () => supprimerProjet(travail.id));
    item.append(img, del);
    container.appendChild(item);
  });
}

function supprimerProjet(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Erreur suppression projet');
      return fetch('http://localhost:5678/api/works', {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then((res) => res.json())
    .then((data) => {
      travaux.length = 0;
      travaux.push(...data);
      afficherTravauxMain(travaux);
      afficherTravauxModal(travaux);
    })
    .catch((err) => {
      console.error(err);
      alert('Erreur lors de la suppression');
    });
}

function resetFormulaireModal() {
  const fileInput = document.getElementById('imageFile');
  const titleInput = document.getElementById('imageTitle');
  const selectCat = document.getElementById('imageCategory');
  const previewImg = document.getElementById('previewImg');
  const previewContainer = document.getElementById('previewContainer');
  const uploadIllustration = document.querySelector('.upload-section > img');
  const fileLabel = document.querySelector('.file-label');
  const fileGuideline = document.querySelector('.file-guideline');
  const fileNameDiv = document.getElementById('fileName');
  const submitBtn = document.querySelector('.btn-valider');

  if (!fileInput || !titleInput || !selectCat) return;

  fileInput.value = '';
  titleInput.value = '';
  selectCat.value = '';
  previewImg.src = '';
  previewContainer.classList.add('hidden');
  uploadIllustration.classList.remove('hidden');
  fileLabel.classList.remove('hidden');
  fileGuideline.classList.remove('hidden');
  fileNameDiv.classList.add('hidden');
  fileNameDiv.textContent = '';
  submitBtn.disabled = true;
}
