import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getNextImageId } from '../utils/getNextSequence.js';
import auth from '../middlewares/auth.js'; // 👈 AÑADIDO
import Image from '../models/Image.js'; // 👈 Para guardar datos de la imagen

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: async function (req, file, cb) {
    const id = await getNextImageId();
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('image'), async (req, res) => { // 👈 PROTEGIDA
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });

  const filename = req.file.filename;
  const imageUrl = `/uploads/images/${filename}`;

  // Guarda en la base de datos
  const newImage = new Image({
    filename,
    url: imageUrl,
    uploader: req.user._id // 👈 Guarda el usuario que subió
  });

  await newImage.save();

  res.json({
    message: 'Imagen subida correctamente',
    imageUrl
  });
});

export default router;
