document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); /* empeche l'envoie classique du formualire */

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("loginError");
  
    const email = emailInput.value;
    const password = passwordInput.value;
  
    // Réinitialiser l'état des inputs
    emailInput.classList.remove("error");
    passwordInput.classList.remove("error");
    errorMsg.style.display = "none";

    fetch('http://localhost:5678/api/users/login', { 

        method:"POST", 
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify({
            email:email,
            password:password
        })
    })

    .then(response => response.json())
    .then(data => { 
        console.log(data);
        if (data.token) {
            sessionStorage.setItem("token",data.token); /* on stock le token dans le local storage */
            alert("Connexion réussie !"); /* va rediriger ou affiche un message */
            window.location.href = "index.html"; /* redirection vers la page d'accueil */
        } else { 
            emailInput.classList.add("error");
            passwordInput.classList.add("error");
            errorMsg.textContent = "Identifiant ou mot de passe incorrect";
            errorMsg.style.display = "block"; 

            emailInput.value= "";
            passwordInput.value=""; /* on vide les champs */
        }
    })
    .catch(err => { 
        console.error(err);  /* affiche l'erreur dans la console */
        alert("Une erreur est survenue ");
    });
});