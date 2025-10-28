const express = require('express');
const router = express.Router();
const PetController = require('../controllers/PetController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const upload = require('../config/multer');

// Rotas públicas
router.get('/pets', PetController.index);
router.get('/pets/:id', PetController.show);

// Rotas administrativas
router.get('/admin/pets', ensureAdmin, PetController.index);
router.get('/admin/pets/new', ensureAdmin, PetController.create);
router.post('/admin/pets', ensureAdmin, upload.single('imagem'), PetController.store);
router.get('/admin/pets/edit/:id', ensureAdmin, PetController.edit);
router.post('/admin/pets/update/:id', ensureAdmin, upload.single('imagem'), PetController.update);
router.post('/admin/pets/delete/:id', ensureAdmin, PetController.delete);

module.exports = router;