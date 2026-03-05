const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const dayjs = require('dayjs');
const sequelize = require('./db/sequelize');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Nunjucks
const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});

env.addFilter('date', (date, format) => {
  return dayjs(date).format(format);
});

app.set('view engine', 'njk');

// Middleware para servir archivos estáticos (CSS, JS cliente, Imágenes del front)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON y urlencoded (formularios HTML)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Rutas de usuario
const usuarioRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
const tipoProductoRoutes = require('./routes/tipoProducto.routes');
const modeloProductoRoutes = require('./routes/modeloProducto.routes');
const productoRoutes = require('./routes/producto.routes');
const imagenRoutes = require('./routes/imagen.routes');
const eventoRoutes = require('./routes/evento.routes');
const posteoRoutes = require('./routes/posteo.routes');
const mensajeContactoRoutes = require('./routes/mensajeContacto.routes');
const viewsRoutes = require('./routes/views.routes');

app.use('/api', usuarioRoutes);
app.use('/api', authRoutes);
app.use('/api', tipoProductoRoutes);
app.use('/api', modeloProductoRoutes);
app.use('/api', productoRoutes);
app.use('/api', imagenRoutes);
app.use('/api', eventoRoutes);
app.use('/api', posteoRoutes);
app.use('/api', mensajeContactoRoutes);
app.use('/', viewsRoutes);

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// (La ruta '/' será manejada ahora por views.routes)

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
