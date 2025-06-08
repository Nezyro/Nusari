const express = require('express');
const router = express.Router();
const { 
  createStory, 
  getStories, 
  getStory, 
  getUserStories,
  updateStory, 
  deleteStory 
} = require('../controllers/storyController');
const auth = require('../middlewares/auth');
const Story = require('../models/Story');

// Public routes
router.get('/', getStories);

// Protected routes
router.post('/', auth, createStory);
router.get('/user', auth, getUserStories);
router.get('/:id', getStory);
router.put('/:id', auth, updateStory);
router.delete('/:id', auth, deleteStory);

module.exports = router; 