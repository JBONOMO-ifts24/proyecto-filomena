const express = require('express');
const modeloCtrl = require('../controllers/modeloProductoController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

function getHandler(name) {
  if (typeof modeloCtrl[name] === 'function') return modeloCtrl[name];
  console.warn(`Warning: modeloProductoController.${name} no es una función (found ${typeof modeloCtrl[name]})`);
  return (req, res) => res.status(500).json({ error: `Handler ${name} no disponible en el servidor` });
}

// Rutas (si falta la función, se usa un handler por defecto que responde 500)
router.post('/modelos', verifyToken, adminOnly, getHandler('crearModeloProducto'));
router.put('/modelos/:id', verifyToken, adminOnly, getHandler('modificarModeloProducto'));
router.delete('/modelos/:id', verifyToken, adminOnly, getHandler('eliminarModeloProducto'));
router.get('/modelos', verifyToken, adminOnly, getHandler('listarModelosProducto'));

module.exports = router;
