
const sequelize = require('./db/sequelize');
const Usuario = require('./models/Usuario');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida.');

        const adminExists = await Usuario.findOne({ where: { rol: 'admin' } });
        if (adminExists) {
            console.log('Ya existe un administrador:', adminExists.nombreUsuario);
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const admin = await Usuario.create({
            nombre: 'Administrador',
            apellido: 'Filomena',
            nombreUsuario: 'admin_filomena',
            email: 'admin@filomena.com.ar',
            password: hashedPassword,
            rol: 'admin'
        });

        console.log('Admin creado con éxito:');
        console.log('Usuario:', admin.nombreUsuario);
        console.log('Password: Admin123!');
    } catch (error) {
        console.error('Error creando admin:', error);
    } finally {
        await sequelize.close();
    }
}

createAdmin();
