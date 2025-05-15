// categories.js - Gère les filtres de catégories au clic
import { afficherTravauxMain, travaux } from './travaux.js';

export function fetchCategories() {
  fetch('http://localhost:5678/api/categories')
    .then((res) => res.json())
    .then((categories) => {
      const filtersContainer = document.querySelector('.filters');
      if (!filtersContainer) return;

      const btnAll = document.createElement('button');
      btnAll.innerText = 'Tous';
      btnAll.classList.add('active');
      btnAll.addEventListener('click', () => {
        afficherTravauxMain(travaux);
        activerFiltre(btnAll);
      });
      filtersContainer.appendChild(btnAll);

      categories.forEach((c) => {
        const btn = document.createElement('button');
        btn.innerText = c.name;
        btn.addEventListener('click', () => {
          const filtres = travaux.filter((t) => t.categoryId == c.id);
          afficherTravauxMain(filtres);
          activerFiltre(btn);
        });
        filtersContainer.appendChild(btn);
      });
    })
    .catch(console.error);
}

function activerFiltre(filtre) {
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach((b) => b.classList.remove('active'));
  filtre.classList.add('active');
}
