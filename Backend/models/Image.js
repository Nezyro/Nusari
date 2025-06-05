import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true }, // Ej: "1.jpg"
  url: { type: String, required: true }, // Ruta o URL pública
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['image', 'story'], default: 'image' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
