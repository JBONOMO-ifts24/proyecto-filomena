const express = require('express');
const { listarConfiguraciones, obtenerConfiguracion, crearOActualizarConfiguracion, eliminarConfiguracion } = require('../controllers/configuracionController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Rutas para configuraciones (solo admin)
router.get('/configuraciones', auth, admin, listarConfiguraciones);
router.get('/configuraciones/:clave', auth, admin, obtenerConfiguracion);
router.post('/configuraciones', auth, admin, crearOActualizarConfiguracion);
router.delete('/configuraciones/:id', auth, admin, eliminarConfiguracion);

module.exports = router;