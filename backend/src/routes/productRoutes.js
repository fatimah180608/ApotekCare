const router = require('express').Router();
const { getAll, getById, getCategories, create, update, remove, restock } = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/categories', getCategories);
router.get('/:id', getById);
router.post('/', authenticate, isAdmin, create);
router.put('/:id', authenticate, isAdmin, update);
router.patch('/:id/restock', authenticate, isAdmin, restock);
router.delete('/:id', authenticate, isAdmin, remove);

module.exports = router;