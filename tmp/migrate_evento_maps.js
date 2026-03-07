const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        await sequelize.authenticate();
        const queryInterface = sequelize.getQueryInterface();

        console.log('Adding column "googleMapsUrl" to Eventos...');
        await queryInterface.addColumn('Eventos', 'googleMapsUrl', {
            type: DataTypes.TEXT,
            allowNull: true
        });

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
