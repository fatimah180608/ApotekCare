const prisma = require('../config/db');

const getCart = async (req, res) => {
  const carts = await prisma.cart.findMany({
    where: { userId: req.user.id }, include: { product: true }
  });
  res.json(carts);
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const existing = await prisma.cart.findFirst({
      where: { userId: req.user.id, productId: Number(productId) }
    });
    if (existing) {
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) }
      });
      return res.json(updated);
    }
    const cart = await prisma.cart.create({
      data: { userId: req.user.id, productId: Number(productId), quantity: quantity || 1 }
    });
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQty = async (req, res) => {
  try {
    const cart = await prisma.cart.update({
      where: { id: Number(req.params.id) },
      data: { quantity: Number(req.body.quantity) }
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await prisma.cart.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Item dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateQty, removeFromCart };