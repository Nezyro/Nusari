// models/Story.js
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Usamos contador como con las imágenes
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String }, // Puede ser un ObjectId si hay auth
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Story', storySchema);
