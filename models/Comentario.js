const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Usuario = require('./Usuario');
const Posteo = require('./Posteo');

const Comentario = sequelize.define('Comentario', {
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Relación: Un Comentario pertenece a un Usuario (el que comenta)
Comentario.belongsTo(Usuario, {
    foreignKey: {
        name: 'usuarioId',
        allowNull: false
    },
    as: 'autor'
});

Usuario.hasMany(Comentario, {
    foreignKey: 'usuarioId',
    as: 'comentarios'
});

// Relación: Un Comentario pertenece a un Posteo
Comentario.belongsTo(Posteo, {
    foreignKey: {
        name: 'posteoId',
        allowNull: false
    },
    as: 'posteo'
});

Posteo.hasMany(Comentario, {
    foreignKey: 'posteoId',
    as: 'comentarios'
});

module.exports = Comentario;
