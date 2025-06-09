const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar entrada
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }
    }

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generar token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener usuario actual
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
};

// Actualizar perfil de usuario
const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar nombre de usuario si se proporciona
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }
      user.username = username;
    }

    // Actualizar email si se proporciona
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }
      user.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Subir imagen de perfil
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      // Eliminar el archivo subido si el usuario no se encuentra
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar imagen de perfil anterior si existe
    if (user.profileImage && user.profileImage !== 'default-profile.jpg') {
      const oldImagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
      try {
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }

    // Actualizar imagen de perfil
    user.profileImage = `perfiles/${req.file.filename}`;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error al subir imagen de perfil:', error);
    res.status(500).json({ error: 'Error al subir imagen de perfil' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  uploadProfilePicture
}; 