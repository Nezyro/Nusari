const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',              
  'https://nusari.vercel.app/',         
  'https://nusari.onrender.com'      
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'nusari' // Especificar explícitamente el nombre de la base de datos
})
  .then(() => console.log('Connected to MongoDB - Database: nusari'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/stories', require('./routes/stories'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
