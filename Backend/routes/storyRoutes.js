import express from 'express';
import Story from '../models/Story.js';
import { getNextImageId } from '../utils/getNextSequence.js';
import auth from '../middlewares/auth.js'; // 👈 AÑADIDO

const router = express.Router();

router.post('/upload', auth, async (req, res) => { // 👈 PROTEGIDA CON auth
  const { title, content } = req.body;

  if (!title || !content) return res.status(400).json({ error: 'Faltan campos' });

  const id = await getNextImageId();

  const newStory = new Story({
    id,
    title,
    content,
    author: req.user._id // 👈 GUARDA QUIÉN LO SUBIÓ
  });

  await newStory.save();

  res.json({ message: 'Relato guardado', id });
});

export default router;
