const router = require('express').Router();
const { getCart, addToCart, updateQty, removeFromCart } = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateQty);
router.delete('/:id', removeFromCart);

module.exports = router;