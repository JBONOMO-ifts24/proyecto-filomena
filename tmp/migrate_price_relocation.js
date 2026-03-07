const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        await sequelize.authenticate();
        const queryInterface = sequelize.getQueryInterface();

        console.log('Adding column "precio" to Productos...');
        await queryInterface.addColumn('Productos', 'precio', {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        });

        console.log('Removing column "precio" from TipoProductos...');
        await queryInterface.removeColumn('TipoProductos', 'precio');

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
