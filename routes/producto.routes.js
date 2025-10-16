const express = require('express');
const { crearProducto, listarProductos, eliminarProducto, modificarProducto } = require('../controllers/productoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/productos', auth, admin, crearProducto);
router.get('/productos', auth, admin, listarProductos);
router.delete('/productos/:id', auth, admin, eliminarProducto);
router.put('/productos/:id', auth, admin, modificarProducto);

module.exports = router;
