import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedItems: [{
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  type: { type: String, enum: ['image', 'story'] }
}]
});




export default mongoose.model('User', userSchema);
