const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, uploadProfilePicture } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.post('/profile/picture', auth, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router; 