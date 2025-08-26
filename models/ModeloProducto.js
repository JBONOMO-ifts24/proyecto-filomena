const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const TipoProducto = require('./Tipo_Producto');

const ModeloProducto = sequelize.define('ModeloProducto', {
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
  }
});

// Relación: Un ModeloProducto pertenece a un TipoProducto
ModeloProducto.belongsTo(TipoProducto, {
  foreignKey: {
    name: 'tipoProductoId',
    allowNull: false
  },
  as: 'tipo_producto'
});

TipoProducto.hasMany(ModeloProducto, {
  foreignKey: 'tipoProductoId',
  as: 'modelos'
});

module.exports = ModeloProducto;
