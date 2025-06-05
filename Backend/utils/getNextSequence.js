// utils/getNextSequence.js
import Counter from '../models/Counter.js';

export async function getNextImageId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'image' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}
