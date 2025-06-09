const Story = require('../models/Story');

// Crear nueva historia
const createStory = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const story = new Story({
      title,
      content,
      tags,
      author: req.user._id
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
};

// Obtener todas las historias
const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
};

// Obtener una historia específica
const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'username profileImage');
    
    if (!story) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }
    
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la historia', error: error.message });
  }
};

// Obtener historias de un usuario
const getUserStories = async (req, res) => {
  try {
    console.log('Buscando historias del usuario:', req.user._id);
    
    const stories = await Story.find({ author: req.user._id })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });
    
    console.log('Historias encontradas:', stories.length);
    res.json(stories);
  } catch (error) {
    console.error('Error al obtener las historias del usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener tus relatos',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


module.exports = {
  createStory,
  getStories,
  getStory,
  getUserStories
}; 