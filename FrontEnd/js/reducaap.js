// ===== Variables globales =====
let travaux = [];
let categories = [];
const token = sessionStorage.getItem("token");

// ====== UPLOAD ======
function setupUploadEvents() {
  const fileInput = document.getElementById("imageFile");
  const titleInput = document.getElementById("imageTitle");
  const selectCat = document.getElementById("imageCategory");
  const submitBtn = document.querySelector(".btn-valider");
  const uploadForm = document.getElementById("uploadForm");
  const previewImg = document.getElementById("previewImg");
  const previewContainer = document.getElementById("previewContainer");
  const fileNameDiv = document.getElementById("fileName");
  const uploadIllustration = document.querySelector(".upload-section > img");
  const fileLabel = document.querySelector(".file-label");
  const fileGuideline = document.querySelector(".file-guideline");

  function checkFormValidity() {
    const hasFile = fileInput.files.length > 0;
    const hasTitle = titleInput.value.trim().length > 0;
    const hasCat = selectCat.value !== "";
    submitBtn.disabled = !(hasFile && hasTitle && hasCat);
  }

  fileInput.addEventListener("change", checkFormValidity);
  titleInput.addEventListener("input", checkFormValidity);
  selectCat.addEventListener("change", checkFormValidity);

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const title = titleInput.value;
    const category = selectCat.value;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur ajout projet");
        return res.json();
      })
      .then((newWork) => {
        travaux.push(newWork);
        afficherTravauxMain(travaux);
        afficherTravauxModal(travaux);
        document.getElementById("modal-modif").classList.add("hidden");
        resetFormulaireModal();
        document.querySelector(".view--form").classList.add("hidden");
        document.querySelector(".view--list").classList.remove("hidden");
      })
      .catch((err) => alert(err.message));
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) {
      previewContainer.classList.add("hidden");
      previewImg.src = "";
      uploadIllustration.classList.remove("hidden");
      fileLabel.classList.remove("hidden");
      fileGuideline.classList.remove("hidden");
      return;
    }
    uploadIllustration.classList.add("hidden");
    fileLabel.classList.add("hidden");
    fileGuideline.classList.add("hidden");

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

// ====== INITIALISATION GLOBALE ======
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  initAuth();
  fetchTravaux();
  fetchCategories().then(() => {
    afficherCategoriesFiltres();
  });
  setupModalEvents();
  setupUploadEvents();
  document.getElementById("modal-modif").addEventListener("click", function(e) {
    if (e.target === this) closeModal();
  });
}

// ====== AUTHENTIFICATION & MODALE ======
function initAuth() {
  const authLink = document.querySelector("#authLink");
  const btnOpen = document.getElementById("openModalBtn");

  if (token) {
    authLink.textContent = "logout";
    authLink.removeAttribute("href");
    authLink.style.cursor = "pointer";
    btnOpen.style.display = "flex"; 

    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "./login.html";
    });

    btnOpen.addEventListener("click", openModal);
    document.querySelector(".modal-content .close")
            .addEventListener("click", closeModal);
  } else {
    authLink.textContent = "login";
    authLink.href = "./login.html";
    btnOpen.style.display = "none";
  }
}

// ====== TRAVAUX ======
function fetchTravaux() {
  fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (!response.ok) throw new Error("Erreur lors de la récupération des travaux");
      return response.json();
    })
    .then((data) => {
      travaux = data;
      afficherTravauxMain(travaux);
      afficherTravauxModal(travaux);
    })
    .catch((error) => console.error("Erreur:", error));
}

function afficherTravauxMain(travaux) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  travaux.forEach((travail) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = travail.imageUrl;
    img.alt = travail.title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = travail.title;
    figure.append(img, figcaption);
    gallery.appendChild(figure);
  });
}

function fetchCategories () { 
  return fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      categories = data; //on stock les catégories
      return categories;
    })
}
function afficherCategoriesFiltres() {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = ''; 
  if (token) {

    return ;
  }

  const btnAll = document.createElement("button");
  btnAll.innerText = "Tous";
  btnAll.classList.add("active");
  btnAll.addEventListener("click", () => {
    afficherTravauxMain(travaux);
    activerFiltre(btnAll);
  });
  filtersContainer.appendChild(btnAll);

  categories.forEach((c) => {
    const btn = document.createElement("button");
    btn.innerText = c.name;
    btn.addEventListener("click", () => {
      const filtres = travaux.filter((t) => t.categoryId == c.id);
      afficherTravauxMain(filtres);
      activerFiltre(btn);
    });
    filtersContainer.appendChild(btn);
  });
}
function afficherCategoriesSelect() {
  const selectCat = document.getElementById("imageCategory");
  if (!selectCat) return;
  selectCat.innerHTML = '<option value="" disabled selected></option>';
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    selectCat.appendChild(opt);
  });
}


function activerFiltre(filtre) {
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((b) => b.classList.remove("active"));
  filtre.classList.add("active");
}

// ====== MODALE ======
function openModal() {
  document.getElementById("modal-modif").classList.remove("hidden");
  afficherTravauxModal(travaux); 

  document.querySelector(".view--form").classList.add("hidden");
  document.querySelector(".view--list").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-modif").classList.add("hidden");
  resetFormulaireModal();
  document.querySelector(".view--form").classList.add("hidden");
  document.querySelector(".view--list").classList.remove("hidden");
}

function afficherTravauxModal(travaux) {
  const projectsContainer = document.querySelector(".projects-container");
  projectsContainer.innerHTML = "";
  travaux.forEach((travail) => {
    const item = document.createElement("div");
    item.classList.add("project-item");
    const img = document.createElement("img");
    img.src = travail.imageUrl;
    img.alt = travail.title;
    const del = document.createElement("span");
    del.classList.add("delete-icon");
    const icon = document.createElement("img");
    icon.src = "assets/icons/Vectorrr.png";
    icon.alt = "Supprimer";
    del.appendChild(icon);
    del.addEventListener("click", () => deleteProjet(travail.id));
    item.append(img, del);
    projectsContainer.appendChild(item);
  });
}

function deleteProjet(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erreur suppression projet");
      fetchTravaux(); // <-- Appelle simplement la fonction factorisée
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur lors de la suppression");
    });
}

function resetFormulaireModal() {
  const fileInput = document.getElementById("imageFile");
  const titleInput = document.getElementById("imageTitle");
  const selectCat = document.getElementById("imageCategory");
  const previewImg = document.getElementById("previewImg");
  const previewContainer = document.getElementById("previewContainer");
  const uploadIllustration = document.querySelector(".upload-section > img");
  const fileLabel = document.querySelector(".file-label");
  const fileGuideline = document.querySelector(".file-guideline");
  const fileNameDiv = document.getElementById("fileName");
  const submitBtn = document.querySelector(".btn-valider");

  fileInput.value = "";
  titleInput.value = "";
  selectCat.value = "";
  previewImg.src = "";
  previewContainer.classList.add("hidden");
  uploadIllustration.classList.remove("hidden");
  fileLabel.classList.remove("hidden");
  fileGuideline.classList.remove("hidden");
  fileNameDiv.classList.add("hidden");
  fileNameDiv.textContent = "";
  submitBtn.disabled = true;
}

function setupModalEvents() {
  const btnAjouter = document.querySelector(".btn-ajouter");
  const btnBack = document.querySelector(".back-arrow");
  const viewList = document.querySelector(".view--list");
  const viewForm = document.querySelector(".view--form");

  btnAjouter.addEventListener("click", () => {
    viewList.classList.add("hidden");
    viewForm.classList.remove("hidden");
    afficherCategoriesSelect();
  });

  btnBack.addEventListener("click", () => {
    viewForm.classList.add("hidden");
    viewList.classList.remove("hidden");
    resetFormulaireModal();
  });
}i