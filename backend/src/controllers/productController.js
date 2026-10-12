const prisma = require('../config/db');

const getAll = async (req, res) => {
  const { category, search } = req.query;
  const where = {};
  if (category) where.categoryId = Number(category);
  if (search) where.name = { contains: search };
  const products = await prisma.product.findMany({
    where, include: { category: true }, orderBy: { createdAt: 'desc' }
  });
  res.json(products);
};

const getById = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) }, include: { category: true }
  });
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json(product);
};

const getCategories = async (req, res) => {
  res.json(await prisma.category.findMany());
};

const create = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, image, unit } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), stock: Number(stock), categoryId: Number(categoryId), image, unit }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, image, unit } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, description, price: Number(price), stock: Number(stock), categoryId: Number(categoryId), image, unit }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Produk dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==== RESTOCK ====
const restock = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Jumlah tidak valid' });
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { stock: { increment: Number(amount) } }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, getCategories, create, update, remove, restock };