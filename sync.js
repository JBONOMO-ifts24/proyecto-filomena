
const sequelize = require('./db/sequelize');
require('./models/Usuario');
require('./models/Tipo_Producto');
require('./models/ModeloProducto');
require('./models/Producto');
require('./models/Imagen');
require('./models/Evento');
require('./models/Posteo');
require('./models/Comentario');
require('./models/MensajeContacto');

sequelize.sync({ force: true }).then(() => {
  console.log('¡Tablas recreadas!');
  process.exit();
}).catch(err => {
  console.error('Error al sincronizar:', err);
  process.exit(1);
});
