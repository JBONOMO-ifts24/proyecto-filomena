const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Registro público -> POST /api/usuarios
router.post('/', usuarioCtrl.crearUsuario);

// Listar usuarios (solo admin) -> GET /api/usuarios
router.get('/', adminOnly, usuarioCtrl.obtenerUsuarios);

// Suspender usuario (solo admin) -> PATCH /api/usuarios/:id/suspender
router.patch('/:id/suspender', adminOnly, usuarioCtrl.suspenderUsuario);

module.exports = router;
