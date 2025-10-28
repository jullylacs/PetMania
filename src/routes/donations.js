const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationController');
const { ensureAuthenticated } = require('../middleware/auth');

// Rotas públicas
router.get('/donations', DonationController.index);
router.get('/donations/new', ensureAuthenticated, DonationController.create);
router.post('/donations', ensureAuthenticated, DonationController.store);
router.get('/donations/payment/:id', ensureAuthenticated, DonationController.paymentForm);
router.post('/donations/payment/:id', ensureAuthenticated, DonationController.processPayment);

module.exports = router;