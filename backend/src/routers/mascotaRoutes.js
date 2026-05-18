const express = require('express'); //
const router = express.Router(); //
const mascotaController = require('../controllers/mascotaController'); //
const verificadoJWT = require('../middleware/authMiddleware'); //

// Ruta para obtener el catálogo
router.get('/', verificadoJWT, mascotaController.obtenerMascotas); //

// ❌ Ruta para eliminar mascota
router.delete('/:id', verificadoJWT, mascotaController.eliminarMascota);

// ✏️ Ruta para editar mascota
router.put('/:id', verificadoJWT, mascotaController.actualizarMascota);

module.exports = router; //

// ➕ Ruta para registrar una nueva mascota
router.post('/', verificadoJWT, mascotaController.crearMascota);

module.exports = router; //