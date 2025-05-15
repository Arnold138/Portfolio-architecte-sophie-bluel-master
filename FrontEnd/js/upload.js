// upload.js - Gère l'ajout de projet et la prévisualisation de l'image
import { travaux, afficherTravauxMain } from './travaux.js';
import { closeModal } from './modal.js';

const token = sessionStorage.getItem('token');

export function setupUploadEvents() {
  const fileInput = document.getElementById('imageFile');
  const titleInput = document.getElementById('imageTitle');
  const selectCat = document.getElementById('imageCategory');
  const submitBtn = document.querySelector('.btn-valider');
  const uploadForm = document.getElementById('uploadForm');

  const previewImg = document.getElementById('previewImg');
  const previewContainer = document.getElementById('previewContainer');
  const fileNameDiv = document.getElementById('fileName');
  const uploadIllustration = document.querySelector('.upload-section > img');
  const fileLabel = document.querySelector('.file-label');
  const fileGuideline = document.querySelector('.file-guideline');

  if (!fileInput || !titleInput || !selectCat || !uploadForm) return;

  function checkFormValidity() {
    const hasFile = fileInput.files.length > 0;
    const hasTitle = titleInput.value.trim().length > 0;
    const hasCat = selectCat.value !== '';
    submitBtn.disabled = !(hasFile && hasTitle && hasCat);
  }

  fileInput.addEventListener('change', checkFormValidity);
  titleInput.addEventListener('input', checkFormValidity);
  selectCat.addEventListener('change', checkFormValidity);

  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const title = titleInput.value;
    const category = selectCat.value;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur ajout projet');
        return res.json();
      })
      .then((newWork) => {
        travaux.push(newWork);
        afficherTravauxMain(travaux);
        closeModal();
      })
      .catch((err) => alert(err.message));
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      previewContainer.classList.add('hidden');
      previewImg.src = '';
      uploadIllustration.classList.remove('hidden');
      fileLabel.classList.remove('hidden');
      fileGuideline.classList.remove('hidden');
      return;
    }

    uploadIllustration.classList.add('hidden');
    fileLabel.classList.add('hidden');
    fileGuideline.classList.add('hidden');

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
}
