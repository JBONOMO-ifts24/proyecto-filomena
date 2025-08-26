const express = require('express');
const { crearTipoProducto, eliminarTipoProducto, listarTipoProductos, modificarTipoProducto } = require('../controllers/tipoProductoController');
const auth = require('../middleware/auth');

const router = express.Router();

// Solo usuarios autorizados pueden agregar, eliminar y listar

router.post('/tipoproductos', auth, crearTipoProducto);
router.put('/tipoproductos/:id', auth, modificarTipoProducto);
router.delete('/tipoproductos/:id', auth, eliminarTipoProducto);
router.get('/tipoproductos', auth, listarTipoProductos);

module.exports = router;
