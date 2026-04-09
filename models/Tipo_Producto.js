const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const TipoProducto = sequelize.define('TipoProducto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  paranoid: true
});


module.exports = TipoProducto;
