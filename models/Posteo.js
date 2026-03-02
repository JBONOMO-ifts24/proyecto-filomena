const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Usuario = require('./Usuario');

const Posteo = sequelize.define('Posteo', {
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING(2500),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true // Puede haber posteos sin imagen
    }
});

// Relación: Un Posteo es creado por un Usuario (Admin)
Posteo.belongsTo(Usuario, {
    foreignKey: {
        name: 'usuarioId',
        allowNull: false
    },
    as: 'autor'
});

Usuario.hasMany(Posteo, {
    foreignKey: 'usuarioId',
    as: 'posteos_creados'
});

module.exports = Posteo;
