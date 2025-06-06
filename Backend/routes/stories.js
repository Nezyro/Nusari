const express = require('express');
const router = express.Router();
const { 
  createStory, 
  getStories, 
  getStory, 
  updateStory, 
  deleteStory 
} = require('../controllers/storyController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', getStories);
router.get('/:id', getStory);

// Protected routes
router.post('/', auth, createStory);
router.put('/:id', auth, updateStory);
router.delete('/:id', auth, deleteStory);

module.exports = router; 