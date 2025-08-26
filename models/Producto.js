const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const ModeloProducto = require('./ModeloProducto');

const Producto = sequelize.define('Producto', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

// Relación: Un Producto pertenece a un ModeloProducto
Producto.belongsTo(ModeloProducto, {
  foreignKey: {
    name: 'modeloProductoId',
    allowNull: false
  },
  as: 'modelo'
});

ModeloProducto.hasMany(Producto, {
  foreignKey: 'modeloProductoId',
  as: 'productos'
});

module.exports = Producto;
