export const saveItem = async (req, res) => {
  const { itemId, type } = req.body;
  const user = await User.findById(req.userId);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  user.savedItems.push({ itemId, type });
  await user.save();

  res.json({ message: 'Elemento guardado' });
};
