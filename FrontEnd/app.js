let travaux = []; 

fetch('http://localhost:5678/api/works')
.then(response=> { 
  if(!response.ok) {
    throw new Error("Erreur lors de la récuperation des travaux");
    
  }
  return response.json();
})
.then(data=> {
  travaux=data;
  console.log("travaux récupérés:", travaux);
  afficherTravauxMain(travaux);
})
.catch(error=> {
  console.error("Erreur:",error);
}) 

function afficherTravauxMain(travaux) { 

  const gallery= document.querySelector('.gallery');
  gallery.innerHTML=''; 

  travaux.forEach(travail=> { 
    const figure=document.createElement('figure');
    const img = document.createElement('img');
    img.src=travail.imageUrl;
    img.alt=travail.title;
    const figcaption=document.createElement('figcaption');
    figcaption.innerText=travail.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
} 

fetch('http://localhost:5678/api/categories')
.then(response=> response.json())
.then(categories=> { 


const filtersContainer = document.querySelector('.filters');
const nomsCategories=categories.map(categorie=> categorie.name);
const uniqueNames = [...new Set(nomsCategories)];

const boutonsTous = document.createElement('button');
boutonsTous.innerText='Tous';
boutonsTous.addEventListener('click',() => {
    afficherTravauxMain(travaux);
});

filtersContainer.appendChild(boutonsTous);

categories.forEach(categorie=> { 
    const button = document.createElement('button');
    button.innerText=categorie.name;
    button.addEventListener('click',() => { 
    const travauxFiltres = travaux.filter(t=> t.category.id === categorie.id);
    afficherTravauxMain(travauxFiltres);

    });
    filtersContainer.appendChild(button);
});

}) 
.catch(err=> console.error(err)); 

/* et affichage des projets et mise en place de la modale  */

function afficherTravauxModal(travaux) {
  const projectsContainer= document.querySelector('.projects-container');
  projectsContainer.innerHTML=''; /* vide le conteneur avant d'ajouter les nouveaux projets */
  travaux.forEach(travail=> {

    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');

    const img = document.createElement('img'); /* crée un élément img */
    img.src=travail.imageUrl;
    img.alt=travail.title;

    /* on crée l'icone de suppression des projects*/ 
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');

    const iconImg = document.createElement('img');
    iconImg.src = "assets/icons/Vectorrr.png"; // Remplace par le chemin de ton image vectorielle
    iconImg.alt = "Supprimer";

    deleteIcon.appendChild(iconImg); // Ajoute l'image à l'icône de suppression
    deleteIcon.addEventListener('click',() => {
      supprimerProjet(travail.id); /* fonction suppresion*/
    });


    projectItem.appendChild(img); 
    projectItem.appendChild(deleteIcon) 
    projectsContainer.appendChild(projectItem);

   });
  } 
  function openModal() {
    document.getElementById("modal-modif").classList.remove("hidden");
    afficherTravauxModal(travaux); // On utilise la version "modale"
  } 
  function closeModal() {
    const modal = document.getElementById("modal-modif");
    modal.classList.add("hidden");
  }
  /* fonction de suppression d'un projet */

  function supprimerProjet(projetId) { 
    fetch(`http://localhost:5678/api/works/${projetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => { 
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }
        alert('Projet supprimé avec succès');
        /* raffraichir la galerie */
        return fetch('http://localhost:5678/api/works'); /* on refait une requete pour recuperer les travaux ajout depuis le test*/
    }) 
    .then (response => response.json()) 
    .then(data => { 
      travaux = data; /* on met a jour la variable travaux avec les nouveaux travaux */
      afficherTravauxMain(travaux); /* on affiche les travaux dans la galerie principale */
    })
    
    .catch(err =>{ 
      console.error(err);
      alert('Erreur lors de la suppression du projet');
    });
  } 

  document.addEventListener('DOMContentLoaded', () => { 

    /* verifie si l'utilisateur est connecté en mode admin */
    if (localStorage.getItem('token')) { 
      document.getElementById('openModalBtn').style.display='block'; /* affiche le bouton d'ajout de projet */
    } else { 
      document.getElementById('openModalBtn').style.display='none';
    } 

    /* on atache l'evenement click sur le bouton d'ajout de projet */
    document.getElementById('openModalBtn').addEventListener('click',openModal);

    /* on atache l'evenement click sur le bouton de fermeture de la modale */
    const closeBtn = document.querySelector('.modal-content .close');
    closeBtn.addEventListener('click',closeModal);

  }) 

document.addEventListener('DOMContentLoaded', () => {

  const btnAjouter = document.getElementById('.btn-ajouter');
  const btnBack = document.getElementById('.back-arrow');
  const viewList = document.getElementById('.view--list');
  const viewForm = document.getElementById('.view--form');
  const uploadForm = document.getElementById('uploadForm');
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
  });
  btnAjouter.addEventListener('click', () => {
  viewList.classList.add('hidden');
  viewForm.classList.remove('hidden');
  }); 
  btnBack.addEventListener('click', () => {
    viewList.classList.remove('hidden');
    viewForm.classList.add('hidden');
  } );
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const fileInput = document.getElementById('imageFile');
    const title = document.getElementById('imageTitle').value;
    const category = selectCat.value;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title',title);
    formData.append('category', category);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    .then(res => { 
      if (!res.ok) throw new Error ('Erreur lors de l\'ajout du projet');
      return res.json();
    } )
    .then (newWork => { 
      travaux.push(newWork);
      afficherTravauxMain(travaux); /* on affiche les travaux dans la galerie principale */

      viewForm.classList.add('hidden');
      viewList.classList.remove('hidden');
    }) 
    .catch(err => alert(err.message));
});
});
