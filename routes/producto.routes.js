const express = require('express');

const path = require('path');
const { crearProducto, listarProductos, eliminarProducto, modificarProducto, exportarStock, importarStock } = require('../controllers/productoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const upload = require('../middleware/upload');
const uploadExcel = require('../middleware/uploadExcel');

router.get('/admin/productos/exportar', auth, admin, exportarStock);
router.post('/admin/productos/importar', auth, admin, uploadExcel.single('archivo_stock'), importarStock);

router.post('/productos', auth, admin, upload.array('imagenes', 3), crearProducto);
router.get('/productos', auth, admin, listarProductos);
router.delete('/productos/:id', auth, admin, eliminarProducto);
router.put('/productos/:id', auth, admin, upload.array('imagenes', 3), modificarProducto);

module.exports = router;
