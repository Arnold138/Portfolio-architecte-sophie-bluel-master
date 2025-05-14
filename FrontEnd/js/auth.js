// auth.js - Gère la connexion et la déconnexion depuis le site principal (pas la page de login)

export function initAuth() {
  const token = sessionStorage.getItem('token');
  const authLink = document.querySelector('#authLink');
  const btnOpen = document.getElementById('openModalBtn');

  if (token) {
    authLink.textContent = 'Logout';
    authLink.removeAttribute('href');
    authLink.style.cursor = 'pointer';
    btnOpen.style.display = 'flex';

    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('token');
      window.location.href = './Login.html';
    });
  } else {
    authLink.textContent = 'Login';
    authLink.href = './Login.html';
    btnOpen.style.display = 'none';
  }
}
