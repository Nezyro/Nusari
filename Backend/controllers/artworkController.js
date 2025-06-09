const Artwork = require('../models/Artwork');
const fs = require('fs').promises;
const path = require('path');

// Crear nueva obra de arte
const createArtwork = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const { title, description, tags } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Convertir la ruta del archivo a un formato URL
    const imageUrl = path.join('uploads', 'artworks', path.basename(req.file.path))
      .replace(/\\/g, '/'); // Convertir ruta de Windows a formato URL

    const artwork = new Artwork({
      title,
      description,
      imageUrl,
      user: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    console.log('Creating artwork:', artwork);

    await artwork.save();
    res.status(201).json(artwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    res.status(500).json({ error: 'Error al crear la obra' });
  }
};

// Obtener todas las obras
const getArtworks = async (req, res) => {
  try {
    const query = {};
    if (req.query.user) {
      query.user = req.query.user;
    }
    
    const artworks = await Artwork.find(query)
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.error('Error al obtener las obras:', error);
    res.status(500).json({ 
      error: 'Error al obtener las obras',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Obtener una obra específica
const getArtwork = async (req, res) => {
  try {
    console.log('Buscando obra con ID:', req.params.id);
    
    if (!req.params.id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    const artwork = await Artwork.findById(req.params.id)
      .populate('user', 'username profileImage');
    
    if (!artwork) {
      console.log('Obra no encontrada con ID:', req.params.id);
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    
    console.log('Obra encontrada:', artwork);
    res.json(artwork);
  } catch (error) {
    console.error('Error al obtener la obra:', error);
    res.status(500).json({ 
      error: 'Error al obtener la obra',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Obtener obras de un usuario
const getUserArtworks = async (req, res) => {
  try {
    console.log('Buscando obras del usuario:', req.user._id);
    
    const artworks = await Artwork.find({ user: req.user._id })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    console.log('Obras encontradas:', artworks.length);
    res.json(artworks);
  } catch (error) {
    console.error('Error al obtener las obras del usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener tus obras',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


module.exports = {
  createArtwork,
  getArtworks,
  getArtwork,
  getUserArtworks
}; 