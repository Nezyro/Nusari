import Counter from '../models/Counter.js';

async function getNextImageNumber() {
  const result = await Counter.findOneAndUpdate(
    { name: 'image' },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return result.count;
}
