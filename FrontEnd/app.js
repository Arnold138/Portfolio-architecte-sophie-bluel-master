let travaux = [];

// 1) Récupération et affichage principal des travaux
fetch('http://localhost:5678/api/works')
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
    // Bouton "Tous"
    const btnAll = document.createElement('button');
    btnAll.innerText = 'Tous';
    btnAll.addEventListener('click', () => afficherTravauxMain(travaux));
    filtersContainer.appendChild(btnAll);
    // Un bouton par catégorie
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
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
  .then(res => {
    if (!res.ok) throw new Error('Erreur suppression projet');
    alert('Projet supprimé !');
    return fetch('http://localhost:5678/api/works');
  })
  .then(r => r.json())
  .then(data => {
    travaux = data;
    afficherTravauxMain(travaux);
  })
  .catch(err => {
    console.error(err);
    alert('Erreur lors de la suppression');
  });
}

// 4) Tout le reste dans UN seul DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // 4.1 Afficher/Masquer bouton modale selon token
  const btnOpen = document.getElementById('openModalBtn');
  if (localStorage.getItem('token')) {
    btnOpen.style.display = 'block';
  } else {
    btnOpen.style.display = 'none';
  }
  btnOpen.addEventListener('click', openModal);
  document.querySelector('.modal-content .close').addEventListener('click', closeModal);

  // 4.2 Bascule liste vs form d’ajout
  const btnAjouter = document.querySelector('.btn-ajouter');
  const btnBack    = document.querySelector('.back-arrow');
  const viewList   = document.querySelector('.view--list');
  const viewForm   = document.querySelector('.view--form');
  btnAjouter.addEventListener('click', () => {
    viewList.classList.add('hidden');
    viewForm.classList.remove('hidden');
  });
  btnBack.addEventListener('click', () => {
    viewForm.classList.add('hidden');
    viewList.classList.remove('hidden');
  });

  // 4.3 Injection catégories dans le select de la modale
  const selectCat = document.getElementById('imageCategory');
  fetch('http://localhost:5678/api/categories')
    .then(r => r.json())
    .then(cats => {
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.text  = c.name;
        selectCat.appendChild(opt);
      });
    })
    .catch(console.error);

  // 4.4 Soumission du form d’ajout
  const uploadForm = document.getElementById('uploadForm');
  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    const fileInput = document.getElementById('imageFile');
    const title     = document.getElementById('imageTitle').value;
    const category  = selectCat.value;
    const formData  = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', title);
    formData.append('category', category);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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

  // 4.5 Preview du fichier image
  const inputFile        = document.getElementById('imageFile');
  const previewContainer = document.getElementById('previewContainer');
  const previewImg       = document.getElementById('previewImg');
  const fileNameDiv      = document.getElementById('fileName');

  inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    if (!file) {
      previewContainer.classList.add('hidden');
      previewImg.src         = '';
      fileNameDiv.textContent = '';
      return;
    }
    fileNameDiv.textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
});
