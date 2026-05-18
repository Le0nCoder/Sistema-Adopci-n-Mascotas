const express = require('express');
const router = express.Router();
const adopcionController = require('../controllers/adopcionController');
const verificadoJWT = require('../middleware/authMiddleware'); 

// Endpoint POST para recibir la solicitud de adopción
router.post('/solicitar', verificadoJWT, adopcionController.solicitarAdopcion);

// Exportación obligatoria
module.exports = router;