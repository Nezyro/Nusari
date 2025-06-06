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
    );

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

    await story.remove();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error: error.message });
  }
};

module.exports = {
  createStory,
  getStories,
  getStory,
  updateStory,
  deleteStory
}; 