
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// Ejemplo de modelo: Usuario
const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Permitir nulo para usuarios de Google
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  rol: {
    type: DataTypes.ENUM('usuario', 'admin'),
    allowNull: false,
    defaultValue: 'usuario'
  },
  suspendido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true,
  paranoid: true
});


module.exports = Usuario;
