// travaux.js - Gestion des projets affichés sur la page

export let travaux = [];
const token = sessionStorage.getItem('token');

export function fetchTravaux() {
  fetch('http://localhost:5678/api/works', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erreur lors de la récupération des travaux');
      return response.json();
    })
    .then((data) => {
      travaux = data;
      afficherTravauxMain(travaux);
    })
    .catch((error) => console.error('Erreur:', error));
}

export function afficherTravauxMain(travaux) {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  travaux.forEach((travail) => {
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
