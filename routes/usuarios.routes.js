const express = require('express');

const { crearUsuario, obtenerUsuarios, suspenderUsuario } = require('../controllers/usuarioController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();


router.post('/usuarios', crearUsuario);
router.get('/usuarios', auth, obtenerUsuarios);
router.put('/usuarios/:id/suspender', auth, admin, suspenderUsuario);

module.exports = router;
