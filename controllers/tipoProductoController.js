const TipoProducto = require('../models/Tipo_Producto');

exports.crearTipoProducto = async (req, res) => {
  try {
    const tipo = await TipoProducto.create(req.body);
    res.status(201).json(tipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarTipoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await TipoProducto.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ error: 'Tipo de producto no encontrado' });
    }
    res.json({ mensaje: 'Tipo de producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.modificarTipoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await TipoProducto.update(req.body, { where: { id } });
    if (!actualizados) {
      return res.status(404).json({ error: 'Tipo de producto no encontrado' });
    }
    const tipoActualizado = await TipoProducto.findByPk(id);
    res.json(tipoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listarTipoProductos = async (req, res) => {
  try {
    const tipos = await TipoProducto.findAll();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
