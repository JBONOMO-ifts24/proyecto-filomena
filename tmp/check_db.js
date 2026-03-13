const TipoProducto = require('../models/Tipo_Producto');
const sequelize = require('../db/sequelize');

async function check() {
    try {
        await sequelize.authenticate();
        const table = await sequelize.getQueryInterface().describeTable('TipoProductos');
        console.log(JSON.stringify(table, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
