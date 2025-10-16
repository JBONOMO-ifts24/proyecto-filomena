const express = require('express');
const { crearTipoProducto, eliminarTipoProducto, listarTipoProductos, modificarTipoProducto } = require('../controllers/tipoProductoController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Solo admins pueden agregar, eliminar, modificar y listar
router.post('/tipoproductos', verifyToken, adminOnly, crearTipoProducto);
router.put('/tipoproductos/:id', verifyToken, adminOnly, modificarTipoProducto);
router.delete('/tipoproductos/:id', verifyToken, adminOnly, eliminarTipoProducto);
router.get('/tipoproductos', verifyToken, adminOnly, listarTipoProductos);

module.exports = router;
