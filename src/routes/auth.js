const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

module.exports = router;