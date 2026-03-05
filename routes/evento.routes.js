const express = require('express');
const {
    crearEvento,
    listarEventos,
    modificarEvento,
    eliminarEvento
} = require('../controllers/eventoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Rutas protegidas (solo admin)
router.post('/eventos', auth, admin, crearEvento);
router.put('/eventos/:id', auth, admin, modificarEvento);
router.delete('/eventos/:id', auth, admin, eliminarEvento);

// Ruta pública (podría ser auth si prefieres que solo usuarios logueados lo vean)
router.get('/eventos', listarEventos);

module.exports = router;
