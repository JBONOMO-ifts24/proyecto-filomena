const Evento = require('../models/Evento');

// Crear evento (solo admin)
exports.crearEvento = async (req, res) => {
    try {
        const { tipo, fecha_hora, lugar } = req.body;
        const evento = await Evento.create({
            tipo,
            fecha_hora,
            lugar,
            usuarioId: req.user.id // Extraído del token via middleware auth
        });
        res.status(201).json(evento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar eventos (público o requerido auth dependiendo de la config global, aquí lo haremos por defecto)
exports.listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            order: [['fecha_hora', 'ASC']]
        });
        res.json(eventos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modificar evento (solo admin)
exports.modificarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, fecha_hora, lugar } = req.body;

        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        await evento.update({ tipo, fecha_hora, lugar });
        res.json(evento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar evento (solo admin)
exports.eliminarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        await evento.destroy();
        res.json({ mensaje: 'Evento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
