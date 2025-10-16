const express = require('express');

const sequelize = require('./db/sequelize');

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware para parsear JSON
app.use(express.json());

// Rutas de usuario
const usuarioRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
const tipoProductoRoutes = require('./routes/tipoProducto.routes');
const modeloProductoRoutes = require('./routes/modeloProducto.routes');
const productoRoutes = require('./routes/producto.routes');
const imagenRoutes = require('./routes/imagen.routes');
app.use('/api', usuarioRoutes);
app.use('/api', authRoutes);
app.use('/api', tipoProductoRoutes);
app.use('/api', modeloProductoRoutes);
app.use('/api', productoRoutes);
app.use('/api', imagenRoutes);

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

// Sincronizar modelos y arrancar servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = { app, sequelize };
