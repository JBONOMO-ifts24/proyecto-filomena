const express = require('express');

const path = require('path');
const { crearProducto, listarProductos, eliminarProducto, modificarProducto, exportarStock, importarStock, duplicarProducto, exportarCatalogoZip, exportarGoogleSheets } = require('../controllers/productoController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const upload = require('../middleware/upload');
const uploadExcel = require('../middleware/uploadExcel');

const MAX_PRODUCT_IMAGES = 7;

router.get('/admin/productos/exportar', auth, admin, exportarStock);
router.get('/admin/productos/exportar-sheets', auth, admin, exportarGoogleSheets);
router.get('/admin/catalogo/exportar-zip', auth, admin, exportarCatalogoZip);
router.post('/admin/productos/importar', auth, admin, uploadExcel.single('archivo_stock'), importarStock);

router.post('/productos', auth, admin, upload.array('imagenes', MAX_PRODUCT_IMAGES), crearProducto);
router.get('/productos', auth, admin, listarProductos);
router.delete('/productos/:id', auth, admin, eliminarProducto);
router.put('/productos/:id', auth, admin, upload.array('imagenes', MAX_PRODUCT_IMAGES), modificarProducto);
router.post('/productos/:id/duplicar', auth, admin, duplicarProducto);

module.exports = router;
