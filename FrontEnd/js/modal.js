import {travaux,afficherTravauxMain} from './travaux.js';
const token = sessionStorage.getItem('token');

export function setupModalEvents() {

    const btnOpen= document.querySelector('openModalBtn');
    const btnClose= document.querySelector('.modal-content .close');
    const btnAjouter = document.querySelector('.btn-ajouter');
    const btnBack=document.querySelector('.back-arrow');
    const viewList = document.querySelector('.view--list');
    const viewForm = document.querySelector('.view--form');

    btnOpen.addEventListener('click', openModal);
    btnClose.addEventListener('click',closeModal);
    btnAjouter.addEventListener('click',() => { 
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');

    });
    btnBack.addEventListener('click',() => { 
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
        resetFormulaireModal();
    });
}
export function openModal() { 
    document.getElementById('modal-modif').classList.remove('hidden');
    afficherTravauxMain(travaux);
} 
export function closeModal () { 
    document.getElementById('modal-modif').classList.add('hidden');
    resetFormulaireModal();
}
function afficherTravauxModal(travaux) {
  const container = document.querySelector('.projects-container');
  container.innerHTML = '';
  travaux.forEach(travail => {
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
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(() => {
      return fetch('http://localhost:5678/api/works', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    })
    .then(res => res.json())
    .then(data => {
      travaux.length = 0;
      travaux.push(...data);
      afficherTravauxMain(travaux);
      afficherTravauxModal(travaux);
    })
    .catch(err => alert('Erreur suppression'));
}

function resetFormulaireModal() {
  document.getElementById('uploadForm').reset();
  document.getElementById('previewContainer').classList.add('hidden');
  document.getElementById('previewImg').src = '';
  document.getElementById('fileName').classList.add('hidden');
  document.getElementById('fileName').textContent = '';
  document.querySelector('.upload-section > img').classList.remove('hidden');
  document.querySelector('.file-label').classList.remove('hidden');
  document.querySelector('.file-guideline').classList.remove('hidden');
  document.querySelector('.btn-valider').disabled = true;
}