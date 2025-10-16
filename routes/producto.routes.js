const express = require('express');
const productoCtrl = require('../controllers/productoController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Asegurate que productoCtrl.crearProducto, listarProductos, etc. sean funciones exportadas
router.post('/productos', verifyToken, adminOnly, productoCtrl.crearProducto);
router.put('/productos/:id', verifyToken, adminOnly, productoCtrl.modificarProducto);
router.delete('/productos/:id', verifyToken, adminOnly, productoCtrl.eliminarProducto);
router.get('/productos', productoCtrl.listarProductos); // lectura pública o auth según tu diseño

module.exports = router;
