const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Producto = require('./Producto');

const Imagen = sequelize.define('Imagen', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relación: Una imagen pertenece a un producto
Imagen.belongsTo(Producto, {
  foreignKey: {
    name: 'productoId',
    allowNull: false
  },
  as: 'producto'
});

// Un producto puede tener muchas imágenes
Producto.hasMany(Imagen, {
  foreignKey: 'productoId',
  as: 'imagenes'
});

module.exports = Imagen;
