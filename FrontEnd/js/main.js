import { initAuth } from "./auth.js";
import  {fetchTrvaux} from "./travaux.js";
import { fetchCategories } from"./categories.js";
import { setupModalEvents } from "./modal.js";
import { setupUploadEvents } from "./upload.js";

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    fetchTrvaux();
    fetchCategories();
    setupModalEvents();
    setupUploadEvents();
});