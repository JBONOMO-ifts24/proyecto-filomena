const express = require('express');

const {
    crearUsuario,
    obtenerUsuarios,
    toggleSuspenderUsuario,
    actualizarUsuario,
    eliminarUsuario,
    crearUsuarioAdmin,
    obtenerMiPerfil,
    actualizarMiPerfil
} = require('../controllers/usuarioController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/usuarios/me', auth, obtenerMiPerfil);
router.put('/usuarios/me', auth, actualizarMiPerfil);

router.post('/usuarios', crearUsuario); // Público
router.post('/admin/usuarios', auth, admin, crearUsuarioAdmin); // Solo Admin
router.get('/usuarios', auth, admin, obtenerUsuarios); // Solo Admin puede ver todos
router.put('/usuarios/:id', auth, admin, actualizarUsuario);
router.put('/usuarios/:id/suspender', auth, admin, toggleSuspenderUsuario);
router.delete('/usuarios/:id', auth, admin, eliminarUsuario);

module.exports = router;
