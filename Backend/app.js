const express       = require('express');
const path          = require('path');
const cors          = require('cors');
require('dotenv').config();
const helmet        = require('helmet');
const swaggerUi     = require('swagger-ui-express');
const yaml          = require('yamljs');
const swaggerDocs   = yaml.load('swagger.yaml');

const app = express();

// CORS : accepte toutes les origines, méthodes et headers nécessaires
const corsOptions = {
  origin: true,  // renvoie l'origine de la requête (file://, 127.0.0.1:5500, etc.)
  methods: ['GET','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// ORM / BD
const db = require('./models');
db.sequelize.sync().then(() => console.log('db is ready'));

// Routes
const userRoutes       = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes      = require('./routes/works.routes');

app.use('/api/users',      userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works',      worksRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
