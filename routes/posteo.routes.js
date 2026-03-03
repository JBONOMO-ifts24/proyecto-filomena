const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    crearPosteo,
    modificarPosteo,
    eliminarPosteo,
    listarPosteos,
    agregarComentario,
    eliminarComentario
} = require('../controllers/posteoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Configuración de multer (similar a lo que hay en imagen.routes.js)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Rutas protegidas (solo admin)
router.post('/posteos', auth, admin, upload.single('imagen'), crearPosteo);
router.put('/posteos/:id', auth, admin, upload.single('imagen'), modificarPosteo);
router.delete('/posteos/:id', auth, admin, eliminarPosteo);

// Rutas de visualización (público)
router.get('/posteos', listarPosteos);

// Rutas de Comentarios (cualquier usuario registrado puede comentar)
router.post('/posteos/:id/comentarios', auth, agregarComentario);
router.delete('/comentarios/:id', auth, admin, eliminarComentario);

module.exports = router;
