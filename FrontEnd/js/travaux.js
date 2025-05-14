export let travaux = [];

const token = sessionStorage.getItem("token");

export function fetchTravaux() { 
  fetch("http://localhost:5678/api/works", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      travaux.length = 0;             // Vider le tableau
      travaux.push(...data);          // Ajouter les nouveaux travaux
      afficherTravauxMain(travaux);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des travaux :", error);
    });
}

export function afficherTravauxMain(travaux) { 
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Vider la galerie avant d'ajouter les nouveaux travaux

  travaux.forEach((travail) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = travail.imageUrl;
    image.alt = travail.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = travail.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
