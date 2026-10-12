const prisma = require('../config/db');

// ==== Auto selesai jika estimasi kurir sudah lewat ====
const autoComplete = async (userId = null) => {
  const now = new Date();
  const where = {
    status: 'Dikirim',
    estimatedArrival: { lte: now },
    deliveryMethod: 'Kurir'
  };
  if (userId) where.userId = userId;
  await prisma.order.updateMany({
    where,
    data: { status: 'Selesai', completedAt: now }
  });
};

const generatePayment = (method, total, bank) => {
  const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  const base = bank || method;
  const paymentCode = `${base.toUpperCase().replace(/\s/g, '')}-${randomCode}`;
  let paymentQR = null;
  if (['QRIS', 'OVO', 'GoPay', 'DANA'].includes(method)) {
    paymentQR = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      `${paymentCode}|${total}`
    )}`;
  }
  return { paymentCode, paymentQR };
};

const hitungEstimasi = (courier) => {
  const est = new Date();
  const c = (courier || '').toUpperCase();
  if (c === 'INSTAN' || c === 'GOJEK' || c === 'GRAB') {
    const menit = Math.floor(Math.random() * 330) + 30;
    est.setMinutes(est.getMinutes() + menit);
  } else {
    const hari = Math.floor(Math.random() * 3) + 1;
    est.setDate(est.getDate() + hari);
  }
  return est;
};

const checkout = async (req, res) => {
  try {
    const { address, paymentMethod, paymentBank, deliveryMethod, courier } = req.body;
    if (!paymentMethod || !deliveryMethod)
      return res.status(400).json({ message: 'Metode pembayaran & pengiriman wajib' });
    if (deliveryMethod === 'Kurir' && !address)
      return res.status(400).json({ message: 'Alamat wajib untuk kurir' });
    if (deliveryMethod === 'Kurir' && !courier)
      return res.status(400).json({ message: 'Pilih kurir dulu' });
    if (paymentMethod === 'Transfer Bank' && !paymentBank)
      return res.status(400).json({ message: 'Pilih bank dulu' });

    const carts = await prisma.cart.findMany({
      where: { userId: req.user.id }, include: { product: true }
    });
    if (carts.length === 0) return res.status(400).json({ message: 'Keranjang kosong' });

    for (const c of carts) {
      if (c.quantity > c.product.stock) {
        return res.status(400).json({ message: `Stok ${c.product.name} tidak cukup` });
      }
    }

    const ongkir = deliveryMethod === 'Kurir' ? (courier === 'Instan' ? 15000 : 8000) : 0;
    const subtotal = carts.reduce((s, c) => s + c.product.price * c.quantity, 0);
    const total = subtotal + ongkir;

    // SEMUA order mulai dari status "Diproses"
    // Admin yang akan ubah jadi "Dikirim"/"Siap Diambil" setelah verifikasi
    const { paymentCode, paymentQR } = generatePayment(paymentMethod, total, paymentBank);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          address: deliveryMethod === 'Kurir' ? address : 'Ambil di ApotekCare - Jl. Merdeka No. 12, Jakarta Selatan',
          paymentMethod,
          paymentBank: paymentBank || null,
          paymentCode,
          paymentQR,
          deliveryMethod,
          courier: courier || null,
          status: 'Diproses' // SELALU mulai dari sini
        },
        include: { items: { include: { product: true } } }
      });

      for (const c of carts) {
        await tx.product.update({
          where: { id: c.productId },
          data: { stock: { decrement: c.quantity } }
        });
      }

      await tx.cart.deleteMany({ where: { userId: req.user.id } });
      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  await autoComplete(req.user.id);
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  await autoComplete();
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { items: { include: { product: true } }, user: true }
  });
  if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
  res.json(order);
};

const getAllOrders = async (req, res) => {
  await autoComplete();
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
};

// ==== ADMIN: Verifikasi pembayaran ====
const confirmPayment = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    if (order.paymentConfirmed)
      return res.status(400).json({ message: 'Pembayaran sudah dikonfirmasi' });

    const newStatus = order.deliveryMethod === 'Kurir' ? 'Dikirim' : 'Siap Diambil';

    let estimatedArrival = null;
    let trackingNumber = order.trackingNumber;
    if (order.deliveryMethod === 'Kurir') {
      estimatedArrival = hitungEstimasi(order.courier);
      trackingNumber = `${(order.courier || 'KURIR').toUpperCase().replace(/\s/g, '')}${Date.now().toString().slice(-10)}`;
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentConfirmed: true,
        paidAt: new Date(),
        status: newStatus,
        estimatedArrival,
        trackingNumber
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==== CUSTOMER: Tandai pesanan selesai manual ====
const markAsComplete = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

    // Customer hanya bisa menandai ordernya sendiri
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    if (order.status === 'Selesai') {
      return res.status(400).json({ message: 'Pesanan sudah selesai' });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'Selesai', completedAt: new Date() }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status: 'Dibatalkan' }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        status: req.body.status,
        completedAt: req.body.status === 'Selesai' ? new Date() : null
      }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==== STATISTIK ====
const getStats = async (req, res) => {
  await autoComplete();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.user.count({ where: { role: 'customer' } });
  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ['Dikirim', 'Selesai', 'Siap Diambil'] } },
    _sum: { total: true }
  });

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const result = await prisma.order.aggregate({
      where: {
        createdAt: { gte: d, lt: next },
        status: { in: ['Diproses', 'Dikirim', 'Selesai', 'Siap Diambil'] }
      },
      _sum: { total: true }
    });
    days.push({
      label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      total: result._sum.total || 0
    });
  }

  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  });

  const productIds = topProducts.map((p) => p.productId);
  const productDetails = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });
  const topProductsWithDetail = topProducts.map((tp) => ({
    ...tp,
    product: productDetails.find((p) => p.id === tp.productId)
  }));

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const pendingPayments = await prisma.order.count({
    where: { status: 'Diproses', paymentConfirmed: false, paymentMethod: { not: 'COD' } }
  });

  res.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingPayments,
    salesChart: days,
    topProducts: topProductsWithDetail,
    recentOrders
  });
};

module.exports = {
  checkout, getMyOrders, getOrderById, getAllOrders, updateStatus,
  confirmPayment, cancelOrder, getStats, markAsComplete
};