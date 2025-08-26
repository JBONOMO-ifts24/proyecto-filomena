
const sequelize = require('./db/sequelize');
require('./models/Usuario');
require('./models/Tipo_Producto');

sequelize.sync({ force: true }).then(() => {
  console.log('¡Tablas recreadas!');
  process.exit();
}).catch(err => {
  console.error('Error al sincronizar:', err);
  process.exit(1);
});
