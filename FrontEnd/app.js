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

function afficherTravaux(travaux) { 

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