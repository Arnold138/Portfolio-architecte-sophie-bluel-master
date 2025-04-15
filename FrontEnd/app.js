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
  afficherTravaux(travaux);
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
    afficherTravaux(travaux);
});

filtersContainer.appendChild(boutonsTous);

categories.forEach(categorie=> { 
    const button = document.createElement('button');
    button.innerText=categorie.name;
    button.addEventListener('click',() => { 
    const travauxFiltres = travaux.filter(t=> t.category.id === categorie.id);
    afficherTravaux(travauxFiltres);

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
    deleteIcon.innerHTML="🗑️" /* émoji corbeille essaie injection*/
    deleteIcon.addEventListener('click',() => {
      supprimerProjet(travail.id); /* fonction suppresion*/
    });

    projectItem.appendChild(img); 
    projectItem.appendChild(deleteIcon);
    projectsContainer.appendChild(projectItem);

   });
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