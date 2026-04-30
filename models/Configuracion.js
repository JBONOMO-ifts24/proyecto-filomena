const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Configuracion = sequelize.define('Configuracion', {
    clave: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    valor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'configuraciones'
});

// Función para obtener una configuración por clave
Configuracion.obtener = async function(clave) {
    const config = await this.findOne({ where: { clave } });
    return config ? config.valor : null;
};

// Función para establecer una configuración
Configuracion.establecer = async function(clave, valor, descripcion = null) {
    const [config, created] = await this.findOrCreate({
        where: { clave },
        defaults: { valor, descripcion }
    });
    if (!created) {
        config.valor = valor;
        if (descripcion) config.descripcion = descripcion;
        await config.save();
    }
    return config;
};

module.exports = Configuracion;