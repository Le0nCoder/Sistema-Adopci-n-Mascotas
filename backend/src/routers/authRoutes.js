const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/registro
router.post('/registro', authController.registrarUsuario);

// POST /api/auth/login
router.post('/login', authController.loginUsuario);

module.exports = router;