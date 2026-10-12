const router = require('express').Router();
const {
  checkout, getMyOrders, getOrderById, getAllOrders,
  updateStatus, confirmPayment, cancelOrder, getStats, markAsComplete
} = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.use(authenticate);
router.post('/checkout', checkout);
router.get('/my', getMyOrders);
router.get('/all', isAdmin, getAllOrders);
router.get('/stats', isAdmin, getStats);
router.patch('/:id/confirm', isAdmin, confirmPayment);
router.patch('/:id/complete', markAsComplete); // customer BISA
router.patch('/:id/cancel', isAdmin, cancelOrder);
router.put('/:id/status', isAdmin, updateStatus);
router.get('/:id', getOrderById);

module.exports = router;