const Configuracion = require('../models/Configuracion');

// Obtener todas las configuraciones
const listarConfiguraciones = async (req, res) => {
    try {
        const configuraciones = await Configuracion.findAll({
            order: [['clave', 'ASC']]
        });
        res.json(configuraciones);
    } catch (error) {
        console.error('Error al listar configuraciones:', error);
        res.status(500).json({ error: 'Error al listar configuraciones' });
    }
};

// Obtener una configuración por clave
const obtenerConfiguracion = async (req, res) => {
    try {
        const { clave } = req.params;
        const config = await Configuracion.findOne({ where: { clave } });
        
        if (!config) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        
        res.json(config);
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
};

// Crear o actualizar una configuración
const crearOActualizarConfiguracion = async (req, res) => {
    try {
        const { clave, valor, descripcion } = req.body;
        
        if (!clave || valor === undefined) {
            return res.status(400).json({ error: 'Se requieren los campos clave y valor' });
        }
        
        const config = await Configuracion.establecer(clave, valor, descripcion);
        res.json(config);
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        res.status(500).json({ error: 'Error al guardar configuración' });
    }
};

// Eliminar una configuración
const eliminarConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        const config = await Configuracion.findByPk(id);
        
        if (!config) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        
        await config.destroy();
        res.json({ message: 'Configuración eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar configuración:', error);
        res.status(500).json({ error: 'Error al eliminar configuración' });
    }
};

module.exports = {
    listarConfiguraciones,
    obtenerConfiguracion,
    crearOActualizarConfiguracion,
    eliminarConfiguracion
};