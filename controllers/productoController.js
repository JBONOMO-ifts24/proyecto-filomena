const Producto = require('../models/Producto');
const ModeloProducto = require('../models/ModeloProducto');

exports.crearProducto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, cantidad, modeloProductoId } = req.body;
    // Verificar que el modelo exista
    const modelo = await ModeloProducto.findByPk(modeloProductoId);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo de producto no válido' });
    }
    const producto = await Producto.create({ codigo, nombre, descripcion, cantidad, modeloProductoId });
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ include: [{ model: ModeloProducto, as: 'modelo' }] });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.modificarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { modeloProductoId } = req.body;
    if (modeloProductoId) {
      const modelo = await ModeloProducto.findByPk(modeloProductoId);
      if (!modelo) {
        return res.status(400).json({ error: 'Modelo de producto no válido' });
      }
    }
    const [actualizados] = await Producto.update(req.body, { where: { id } });
    if (!actualizados) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const productoActualizado = await Producto.findByPk(id);
    res.json(productoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
