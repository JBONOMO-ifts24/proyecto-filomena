const express = require('express');
const router = express.Router();
const mensajeContactoController = require('../controllers/mensajeContactoController');
const { authOptional, auth } = require('../middleware/auth');

router.post('/mensajes-contacto', authOptional, mensajeContactoController.crearMensaje);
router.get('/mensajes-contacto', mensajeContactoController.listarMensajes);
router.delete('/mensajes-contacto/:id', auth, mensajeContactoController.eliminarMensaje);

module.exports = router;
