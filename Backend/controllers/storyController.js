const Story = require('../models/Story');

// Create new story
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

// Get all stories
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

// Get single story
const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'username profileImage')
      .populate('comments.user', 'username profileImage');
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story', error: error.message });
  }
};

// Get user's stories
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

// Update story
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'username profileImage');

    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story', error: error.message });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error: error.message });
  }
};

module.exports = {
  createStory,
  getStories,
  getStory,
  getUserStories,
  updateStory,
  deleteStory
}; 