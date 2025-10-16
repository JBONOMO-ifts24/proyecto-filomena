const Evento = require('../models/Evento');

const getAll = async (req, res) => {
  try {
    const eventos = await Evento.findAll({ order: [['fecha', 'ASC'], ['horario', 'ASC']] });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

const getById = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el evento' });
  }
};

const create = async (req, res) => {
  try {
    const { categoria, descripcion, ubicacion, fecha, horario } = req.body;
    const nuevo = await Evento.create({ categoria, descripcion, ubicacion, fecha, horario });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear evento', details: err.message });
  }
};

const update = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    const { categoria, descripcion, ubicacion, fecha, horario } = req.body;
    await evento.update({ categoria, descripcion, ubicacion, fecha, horario });
    res.json(evento);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar evento', details: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    await evento.destroy();
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};

module.exports = { getAll, getById, create, update, remove };