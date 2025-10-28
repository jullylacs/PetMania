const express = require('express');
const router = express.Router();
const AdoptionController = require('../controllers/AdoptionController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/adoption', AdoptionController.index);
router.post('/adoption/request/:petId', ensureAuthenticated, AdoptionController.request);

// Rotas administrativas
router.get('/admin/adoptions', ensureAdmin, AdoptionController.adminIndex);
router.post('/admin/adoptions/:id/approve', ensureAdmin, AdoptionController.approve);
router.post('/admin/adoptions/:id/reject', ensureAdmin, AdoptionController.reject);

module.exports = router;