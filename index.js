const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const multer = require('multer');
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

env.addFilter('pesosAR', (valor) => {
  if (valor === null || valor === undefined || valor === '') return null;
  const num = parseFloat(valor);
  if (isNaN(num)) return null;
  return '$ ' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

// Middleware para inyectar configuraciones dinámicas globales en las vistas
app.use(async (req, res, next) => {
  try {
    const Configuracion = require('./models/Configuracion');
    const dbWhatsapp = await Configuracion.obtener('contact_whatsapp');
    const dbInstagram = await Configuracion.obtener('contact_instagram');
    const dbWhatsappVisible = await Configuracion.obtener('contact_whatsapp_visible');
    const dbInstagramVisible = await Configuracion.obtener('contact_instagram_visible');

    res.locals.CONTACT_WHATSAPP = dbWhatsapp !== null ? dbWhatsapp : (process.env.CONTACT_WHATSAPP || '');
    res.locals.CONTACT_INSTAGRAM = dbInstagram !== null ? dbInstagram : (process.env.CONTACT_INSTAGRAM || '');
    res.locals.CONTACT_WHATSAPP_VISIBLE = dbWhatsappVisible !== null ? dbWhatsappVisible === 'true' : true;
    res.locals.CONTACT_INSTAGRAM_VISIBLE = dbInstagramVisible !== null ? dbInstagramVisible === 'true' : true;
  } catch (error) {
    console.error('Error cargando configuraciones dinámicas:', error);
    res.locals.CONTACT_WHATSAPP = process.env.CONTACT_WHATSAPP || '';
    res.locals.CONTACT_INSTAGRAM = process.env.CONTACT_INSTAGRAM || '';
    res.locals.CONTACT_WHATSAPP_VISIBLE = true;
    res.locals.CONTACT_INSTAGRAM_VISIBLE = true;
  }
  next();
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
const configuracionRoutes = require('./routes/configuracion.routes');

app.use('/api', usuarioRoutes);
app.use('/api', authRoutes);
app.use('/api', tipoProductoRoutes);
app.use('/api', modeloProductoRoutes);
app.use('/api', productoRoutes);
app.use('/api', imagenRoutes);
app.use('/api', eventoRoutes);
app.use('/api', posteoRoutes);
app.use('/api', mensajeContactoRoutes);
app.use('/api', configuracionRoutes);
app.use('/', viewsRoutes);

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Middleware global para manejo de errores (especialmente Multer)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'La imagen supera el límite de tamaño permitido de 2MB.' });
    }
    return res.status(400).json({ error: `Error al subir archivo: ${err.message}` });
  } else if (err) {
    // Si es un error de validación o tipo no permitido, usar 400
    const statusCode = err.status || (err.message && err.message.includes('permitido') ? 400 : 500);
    return res.status(statusCode).json({ error: err.message || 'Error interno del servidor' });
  }
  next();
});

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
