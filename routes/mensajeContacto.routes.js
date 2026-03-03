const express = require('express');
const router = express.Router();
const mensajeContactoController = require('../controllers/mensajeContactoController');
const { authOptional } = require('../middleware/auth');

router.post('/mensajes-contacto', authOptional, mensajeContactoController.crearMensaje);
router.get('/mensajes-contacto', mensajeContactoController.listarMensajes);

module.exports = router;
