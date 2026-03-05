const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Usuario = require('./Usuario');

const MensajeContacto = sequelize.define('MensajeContacto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Relación opcional con Usuario
MensajeContacto.belongsTo(Usuario, {
    foreignKey: {
        name: 'usuarioId',
        allowNull: true
    },
    as: 'usuario'
});

Usuario.hasMany(MensajeContacto, {
    foreignKey: 'usuarioId',
    as: 'mensajes_contacto'
});

module.exports = MensajeContacto;
