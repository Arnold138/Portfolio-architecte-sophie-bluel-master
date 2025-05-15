import '../reducaap.js';
// main.js - Point d'entrée principal de l'application
import { initAuth } from "./auth.js";
import  {fetchTravaux} from "./travaux.js";
import { fetchCategories } from"./categories.js";
import { setupModalEvents } from "./modal.js";
import { setupUploadEvents } from "./upload.js";

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    fetchTravaux();
    fetchCategoriesForFilters();
    setupModalEvents();
    setupUploadEvents();
});