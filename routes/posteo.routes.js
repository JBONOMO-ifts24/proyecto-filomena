const express = require('express');

const {
    crearPosteo,
    modificarPosteo,
    eliminarPosteo,
    listarPosteos,
    agregarComentario,
    eliminarComentario,
    modificarComentario
} = require('../controllers/posteoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const upload = require('../middleware/upload');


// Rutas protegidas (solo admin)
router.post('/posteos', auth, admin, upload.array('imagenes', 3), crearPosteo);
router.put('/posteos/:id', auth, admin, upload.array('imagenes', 3), modificarPosteo);
router.delete('/posteos/:id', auth, admin, eliminarPosteo);

// Rutas de visualización (público)
router.get('/posteos', listarPosteos);

// Rutas de Comentarios (cualquier usuario registrado puede comentar)
router.post('/posteos/:id/comentarios', auth, agregarComentario);
router.put('/comentarios/:id', auth, modificarComentario);
router.delete('/comentarios/:id', auth, eliminarComentario);

module.exports = router;
