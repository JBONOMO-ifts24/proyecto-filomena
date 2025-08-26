const express = require('express');

const { crearUsuario, obtenerUsuarios } = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/usuarios', crearUsuario);
router.get('/usuarios', auth, obtenerUsuarios);

module.exports = router;
