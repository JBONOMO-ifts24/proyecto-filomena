const express = require('express');
const { crearTipoProducto, eliminarTipoProducto, listarTipoProductos, modificarTipoProducto } = require('../controllers/tipoProductoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Solo usuarios autorizados pueden agregar, eliminar y listar

router.post('/tipoproductos', auth, admin, crearTipoProducto);
router.put('/tipoproductos/:id', auth, admin, modificarTipoProducto);
router.delete('/tipoproductos/:id', auth, admin, eliminarTipoProducto);
router.get('/tipoproductos', auth, admin, listarTipoProductos);

module.exports = router;
