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