const express = require('express');
const router = express.Router();
const eventoCtrl = require('../controllers/eventoController');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Lectura pública: cualquier usuario (no autenticado) puede ver eventos
router.get('/', eventoCtrl.getAll);
router.get('/:id', eventoCtrl.getById);

// Escritura: solo admin (adminOnly valida el token y el rol)
router.post('/', adminOnly, eventoCtrl.create);
router.put('/:id', adminOnly, eventoCtrl.update);
router.delete('/:id', adminOnly, eventoCtrl.remove);

module.exports = router;