const sequelize = require('../db/sequelize');

async function migrate() {
    try {
        await sequelize.authenticate();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.addColumn('TipoProductos', 'precio', {
            type: require('sequelize').DataTypes.DECIMAL(10, 2),
            allowNull: true
        });
        console.log('Column "precio" added successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
