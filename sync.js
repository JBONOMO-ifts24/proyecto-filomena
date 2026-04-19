require('dotenv').config();
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

const args = process.argv.slice(2);
const force = args.includes('--force');
const alter = args.includes('--alter');

if (force) {
  console.log('⚠️  MODO FORCE: Se borrarán y recrearán todas las tablas.');
  console.log('    Cancelá ahora (Ctrl+C) si no es lo que querés...');
  setTimeout(runSync, 5000); // 5 segundos para arrepentirse
} else {
  runSync();
}

async function runSync() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');

    if (force) {
      await sequelize.sync({ force: true });
      console.log('✅ Tablas recreadas (force).');
    } else if (alter) {
      await sequelize.sync({ alter: true });
      console.log('✅ Tablas actualizadas (alter) — datos preservados.');
    } else {
      await sequelize.sync();
      console.log('✅ Tablas nuevas creadas — las existentes no fueron tocadas.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error al sincronizar:', err);
    process.exit(1);
  }
}
