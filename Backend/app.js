const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
db.sequelize.sync().then(()=> console.log('db is ready'));
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;

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