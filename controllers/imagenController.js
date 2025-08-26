const Imagen = require('../models/Imagen');
const Producto = require('../models/Producto');
const path = require('path');

exports.subirImagen = async (req, res) => {
  try {
    const { productoId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    // Verificar que el producto exista
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(400).json({ error: 'Producto no válido' });
    }
    const url = `/uploads/${req.file.filename}`;
    const imagen = await Imagen.create({ url, descripcion: req.body.descripcion, productoId });
    res.status(201).json(imagen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listarImagenesPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const imagenes = await Imagen.findAll({ where: { productoId } });
    res.json(imagenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await Imagen.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    // Eliminar archivo físico
    const fs = require('fs');
    const filePath = path.join(__dirname, '../uploads', path.basename(imagen.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await imagen.destroy();
    res.json({ mensaje: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
