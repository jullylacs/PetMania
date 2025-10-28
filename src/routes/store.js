const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { ensureAuthenticated } = require('../middleware/auth');

// Rotas da loja
router.get('/store', StoreController.index);
router.get('/store/products/:category', StoreController.listByCategory);
router.get('/store/products/:id', StoreController.show);
router.post('/store/cart/add/:productId', ensureAuthenticated, StoreController.addToCart);
router.get('/store/cart', ensureAuthenticated, StoreController.showCart);
router.post('/store/cart/remove/:productId', ensureAuthenticated, StoreController.removeFromCart);
router.get('/store/checkout', ensureAuthenticated, StoreController.checkout);
router.post('/store/checkout/process', ensureAuthenticated, StoreController.processCheckout);

module.exports = router;