const express = require('express');
const multer = require('multer');
const path = require('path');
const { subirImagen, listarImagenesPorProducto, eliminarImagen } = require('../controllers/imagenController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Configuración de multer
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

// Subir imagen (protegido)
router.post('/imagenes', verifyToken,adminOnly, upload.single('imagen'), subirImagen);
// Listar imágenes de un producto
router.get('/imagenes/:productoId', listarImagenesPorProducto);
// Eliminar imagen (protegido)
router.delete('/imagenes/:id', verifyToken,adminOnly, eliminarImagen);

module.exports = router;
