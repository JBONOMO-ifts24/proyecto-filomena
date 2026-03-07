const express = require('express');

const path = require('path');
const { subirImagen, listarImagenesPorProducto, eliminarImagen } = require('../controllers/imagenController');
const { auth } = require('../middleware/auth');

const router = express.Router();

const upload = require('../middleware/upload');


// Subir imagen (protegido)
router.post('/imagenes', auth, upload.single('imagen'), subirImagen);
// Listar imágenes de un producto (protegido)
router.get('/imagenes/:productoId', auth, listarImagenesPorProducto);
// Eliminar imagen (protegido)
router.delete('/imagenes/:id', auth, eliminarImagen);

module.exports = router;
