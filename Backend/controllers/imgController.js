import Image from '../models/Image.js';
import Counter from '../models/Counter.js';

const getNextImageNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'image' },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return counter.count;
};

export const uploadImage = async (req, res) => {
  try {
    const { url, type } = req.body;
    const imageNumber = await getNextImageNumber();
    const filename = `${imageNumber}.jpg`;

    const newImage = await Image.create({
      filename,
      url,
      type,
      uploader: req.userId
    });

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: 'Error al subir imagen' });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
};
