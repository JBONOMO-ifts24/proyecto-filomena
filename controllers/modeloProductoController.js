const ModeloProducto = require('../models/ModeloProducto');
const TipoProducto = require('../models/Tipo_Producto');

exports.crearModeloProducto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, tipoProductoId } = req.body;
    // Verificar que el tipo de producto exista
    const tipo = await TipoProducto.findByPk(tipoProductoId);
    if (!tipo) {
      return res.status(400).json({ error: 'Tipo de producto no válido' });
    }
    const modelo = await ModeloProducto.create({ codigo, nombre, descripcion, tipoProductoId });
    res.status(201).json(modelo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listarModeloProductos = async (req, res) => {
  try {
    const modelos = await ModeloProducto.findAll({ include: [{ model: TipoProducto, as: 'tipo_producto' }] });
    res.json(modelos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarModeloProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await ModeloProducto.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ error: 'Modelo de producto no encontrado' });
    }
    res.json({ mensaje: 'Modelo de producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.modificarModeloProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoProductoId } = req.body;
    if (tipoProductoId) {
      const tipo = await TipoProducto.findByPk(tipoProductoId);
      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de producto no válido' });
      }
    }
    const [actualizados] = await ModeloProducto.update(req.body, { where: { id } });
    if (!actualizados) {
      return res.status(404).json({ error: 'Modelo de producto no encontrado' });
    }
    const modeloActualizado = await ModeloProducto.findByPk(id);
    res.json(modeloActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
