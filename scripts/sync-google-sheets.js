require('dotenv').config();
const sequelize = require('../db/sequelize');
const { ejecutarExportacion } = require('../utils/googleSheetsExport');

const run = async () => {
    try {
        console.log('Iniciando sincronización con Google Sheets...');
        console.log('Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('Base de datos conectada.');
        
        const count = await ejecutarExportacion();
        console.log(`¡Éxito! Se sincronizaron ${count} productos con Google Sheets.`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error crítico durante la sincronización:', error.message);
        process.exit(1);
    }
};

run();
