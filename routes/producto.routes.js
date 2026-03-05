const express = require('express');
const multer = require('multer');
const path = require('path');
const { crearProducto, listarProductos, eliminarProducto, modificarProducto } = require('../controllers/productoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Multer: necesario para parsear multipart/form-data (el form incluye un campo de imagen)
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

router.post('/productos', auth, admin, upload.single('imagen'), crearProducto);
router.get('/productos', auth, admin, listarProductos);
router.delete('/productos/:id', auth, admin, eliminarProducto);
router.put('/productos/:id', auth, admin, upload.single('imagen'), modificarProducto);

module.exports = router;
