const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria: {
    type: DataTypes.ENUM('Clase', 'Curso', 'Feria'),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horario: {
    type: DataTypes.TIME,
    allowNull: false
  },
  repite: {
    type: DataTypes.ENUM(
      'semanal',
      'quincenal',
      'mensual',
      'bimensual',
      'trimestral',
      'semestral',
      'anual',
      'a discreción',
      'No'
    ),
    allowNull: false,
    defaultValue: 'No'
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Evento;