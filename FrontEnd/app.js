let travaux = [];
const token = localStorage.getItem('token');

// 1) Récupération et affichage principal des travaux (avec JWT)
fetch('http://localhost:5678/api/works', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors de la récupération des travaux");
    return response.json();
  })
  .then(data => {
    travaux = data;
    console.log("travaux récupérés:", travaux);
    afficherTravauxMain(travaux);
  })
  .catch(error => console.error("Erreur:", error));

function afficherTravauxMain(travaux) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  travaux.forEach(travail => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = travail.imageUrl;
    img.alt = travail.title;
    const figcaption = document.createElement('figcaption');
    figcaption.innerText = travail.title;
    figure.append(img, figcaption);
    gallery.appendChild(figure);
  });
}

// 2) Filtres catégories
fetch('http://localhost:5678/api/categories')
  .then(r => r.json())
  .then(categories => {
    const filtersContainer = document.querySelector('.filters');
    const btnAll = document.createElement('button');
    btnAll.innerText = 'Tous';
    btnAll.addEventListener('click', () => afficherTravauxMain(travaux));
    filtersContainer.appendChild(btnAll);
    categories.forEach(c => {
      const btn = document.createElement('button');
      btn.innerText = c.name;
      btn.addEventListener('click', () => {
        const filtres = travaux.filter(t => t.category.id === c.id);
        afficherTravauxMain(filtres);
      });
      filtersContainer.appendChild(btn);
    });
  })
  .catch(console.error);

// 3) Fonctions modale / suppression
function afficherTravauxModal(travaux) {
  const projectsContainer = document.querySelector('.projects-container');
  projectsContainer.innerHTML = '';
  travaux.forEach(travail => {
    const item = document.createElement('div');
    item.classList.add('project-item');
    const img = document.createElement('img');
    img.src = travail.imageUrl;
    img.alt = travail.title;
    const del = document.createElement('span');
    del.classList.add('delete-icon');
    const icon = document.createElement('img');
    icon.src = "assets/icons/Vectorrr.png";
    icon.alt = "Supprimer";
    del.appendChild(icon);
    del.addEventListener('click', () => supprimerProjet(travail.id));
    item.append(img, del);
    projectsContainer.appendChild(item);
  });
}

function openModal() {
  document.getElementById('modal-modif').classList.remove('hidden');
  afficherTravauxModal(travaux);
}

function closeModal() {
  document.getElementById('modal-modif').classList.add('hidden');
}

function supprimerProjet(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur suppression projet');
      return fetch('http://localhost:5678/api/works', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    })
    .then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then(data => {
      travaux = data;
      afficherTravauxMain(travaux);
    })
    .catch(err => {
      console.error(err);
      alert('Erreur lors de la suppression');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // 4.1 Afficher/Masquer bouton modale selon token
  const btnOpen = document.getElementById('openModalBtn');
  if (token) {
    btnOpen.style.display = 'block';
    btnOpen.addEventListener('click', openModal);
    document.querySelector('.modal-content .close').addEventListener('click', closeModal);
  } else {
    btnOpen.style.display = 'none';
  }

  // 4.2 Bascule liste vs form d’ajout
  const btnAjouter = document.querySelector('.btn-ajouter');
  const btnBack = document.querySelector('.back-arrow');
  const viewList = document.querySelector('.view--list');
  const viewForm = document.querySelector('.view--form');
  btnAjouter.addEventListener('click', () => {
    viewList.classList.add('hidden');
    viewForm.classList.remove('hidden');
  });
  btnBack.addEventListener('click', () => {
    viewForm.classList.add('hidden');
    viewList.classList.remove('hidden');
  });

  // 4.3 Injection catégories dans le select
  const selectCat = document.getElementById('imageCategory');
  fetch('http://localhost:5678/api/categories')
    .then(r => r.json())
    .then(cats => {
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.text = c.name;
        selectCat.appendChild(opt);
      });
    })
    .catch(console.error);

  // 4.4 Activation du bouton valider
  const fileInput = document.getElementById('imageFile');
  const titleInput = document.getElementById('imageTitle');
  const selectInput = selectCat;
  const submitBtn = document.querySelector('.btn-valider');
  submitBtn.disabled = true;
  function checkFormValidity() {
    const hasFile = fileInput.files.length > 0;
    const hasTitle = titleInput.value.trim().length > 0;
    const hasCat = selectInput.value !== '';
    submitBtn.disabled = !(hasFile && hasTitle && hasCat);
  }
  fileInput.addEventListener('change', checkFormValidity);
  titleInput.addEventListener('input', checkFormValidity);
  selectInput.addEventListener('change', checkFormValidity);

  // 4.5 Soumission du form d’ajout
  const uploadForm = document.getElementById('uploadForm');
  uploadForm.addEventListener('submit', e => {
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
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur ajout projet');
        return res.json();
      })
      .then(newWork => {
        travaux.push(newWork);
        afficherTravauxMain(travaux);
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
      })
      .catch(err => alert(err.message));
  });

  // 4.6 Preview du fichier image
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('previewImg');
  const fileNameDiv = document.getElementById('fileName');
  const uploadIllustration = document.querySelector('.upload-section > img');
  const fileLabel = document.querySelector('.file-label');
  const fileGuideline = document.querySelector('.file-guideline');

  fileNameDiv.classList.add('hidden');

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
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
});
