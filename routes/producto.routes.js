const express = require('express');

const path = require('path');
const { crearProducto, listarProductos, eliminarProducto, modificarProducto } = require('../controllers/productoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const upload = require('../middleware/upload');


router.post('/productos', auth, admin, upload.single('imagen'), crearProducto);
router.get('/productos', auth, admin, listarProductos);
router.delete('/productos/:id', auth, admin, eliminarProducto);
router.put('/productos/:id', auth, admin, upload.single('imagen'), modificarProducto);

module.exports = router;
