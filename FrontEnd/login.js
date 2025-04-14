document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); /* empeche l'envoie classique du formualire */

    const email= document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", { 

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
            localStorage.setItem("token",data.token); /* on stock le token dans le local storage */
            alert("Connexion réussie !"); /* va rediriger ou affiche un message */

        } else { 
            alert("Identifiants incorrects."); 
        }
    })
    .catch(err => { 
        console.error(err);  /* affiche l'erreur dans la console */
        alert("Une erreur est survenue ");
    });
});