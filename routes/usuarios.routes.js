const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // debe exportar funciones

// Ejemplo de rutas: PASAR la función, NO invocar (sin paréntesis)
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.post('/usuarios', usuarioController.crearUsuario);
router.delete('/usuarios/:id', usuarioController.suspenderUsuario);

module.exports = router;
