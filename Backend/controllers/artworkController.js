const Artwork = require('../models/Artwork');
const fs = require('fs').promises;
const path = require('path');

// Create new artwork
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

    // Convert the file path to a URL-friendly format
    const imageUrl = path.join('uploads', 'artworks', path.basename(req.file.path))
      .replace(/\\/g, '/'); // Convert Windows path to URL format

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

// Get all artworks
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

// Get single artwork
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

// Get user's artworks
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

// Update artwork
const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }

    if (artwork.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // If there's a new image, delete the old one
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', artwork.imageUrl);
      await fs.unlink(oldImagePath);
      req.body.imageUrl = path.join('uploads', 'artworks', path.basename(req.file.path))
        .replace(/\\/g, '/');
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'username profileImage');

    res.json(updatedArtwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    res.status(500).json({ error: 'Error al actualizar la obra' });
  }
};

// Delete artwork
const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }

    if (artwork.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '..', artwork.imageUrl);
    await fs.unlink(imagePath).catch(console.error);

    await artwork.deleteOne();
    res.json({ message: 'Obra eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Error al eliminar la obra' });
  }
};

module.exports = {
  createArtwork,
  getArtworks,
  getArtwork,
  getUserArtworks,
  updateArtwork,
  deleteArtwork
}; 