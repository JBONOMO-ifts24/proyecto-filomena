const express = require('express');
const { crearModeloProducto, listarModeloProductos, eliminarModeloProducto, modificarModeloProducto } = require('../controllers/modeloProductoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/modeloproductos', auth, admin, crearModeloProducto);
router.get('/modeloproductos', auth, admin, listarModeloProductos);
router.delete('/modeloproductos/:id', auth, admin, eliminarModeloProducto);
router.put('/modeloproductos/:id', auth, admin, modificarModeloProducto);

module.exports = router;
