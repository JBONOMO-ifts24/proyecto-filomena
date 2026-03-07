const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Usuario = require('./Usuario');

const Evento = sequelize.define('Evento', {
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    lugar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    googleMapsUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});


// Relación: Un Evento es creado por un Usuario (Admin)
Evento.belongsTo(Usuario, {
    foreignKey: {
        name: 'usuarioId',
        allowNull: false
    },
    as: 'creador'
});

Usuario.hasMany(Evento, {
    foreignKey: 'usuarioId',
    as: 'eventos_creados'
});

module.exports = Evento;
