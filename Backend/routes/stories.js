const express = require('express');
const router = express.Router();
const { 
  createStory, 
  getStories, 
  getStory, 
  getUserStories
} = require('../controllers/storyController');
const auth = require('../middlewares/auth');
const Story = require('../models/Story');

// Rutas públicas
router.get('/', getStories);

// Rutas protegidas
router.post('/', auth, createStory);
router.get('/user', auth, getUserStories);
router.get('/:id', getStory);

module.exports = router; 