const express = require('express');
const router = express.Router();
const { 
  createArtwork, 
  getArtworks, 
  getArtwork, 
  getUserArtworks, 
  updateArtwork, 
  deleteArtwork 
} = require('../controllers/artworkController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/artworks');
    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar conflictos
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

// Rutas públicas
router.get('/', getArtworks);
router.get('/:id', getArtwork);

// Rutas protegidas
router.post('/', auth, upload.single('image'), createArtwork);
router.get('/mine', auth, getUserArtworks);
router.put('/:id', auth, updateArtwork);
router.delete('/:id', auth, deleteArtwork);

module.exports = router;
