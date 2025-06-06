const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Artwork = require('../models/Artwork');
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

// Ruta POST para crear obra, protegida por auth y con imagen
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    // Procesar tags en array si viene como string separado por comas
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    const artwork = new Artwork({
      user: req.user._id,
      title,
      description,
      category,
      tags: tagsArray,
      imageUrl: `/uploads/artworks/${req.file.filename}`
    });

    await artwork.save();

    res.status(201).json({ message: 'Obra subida con éxito', artwork });
  } catch (error) {
    console.error('Error creando obra:', error);
    res.status(500).json({ error: 'Error al crear la obra' });
  }
});

// Ruta GET para listar todas las obras (opcional)
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.error('Error obteniendo obras:', error);
    res.status(500).json({ error: 'Error al obtener las obras' });
  }
});

// Ruta GET para obtener obras de un usuario
router.get('/mine', auth, async (req, res) => {
  try {
    const artworks = await Artwork.find({ 'author.id': req.user.id });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron cargar tus imágenes' });
  }
});


module.exports = router;
