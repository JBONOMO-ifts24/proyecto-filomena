const Producto = require('../models/Producto');
const xlsx = require('xlsx');
const ModeloProducto = require('../models/ModeloProducto');
const Imagen = require('../models/Imagen');


exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, modeloProductoId, precio } = req.body;
    const codigo = req.body.codigo || `PROD-${Date.now()}`;
    // Verificar que el modelo exista
    const modelo = await ModeloProducto.findByPk(modeloProductoId);
    if (!modelo) {
      return res.status(400).json({ error: 'Modelo de producto no válido' });
    }
    const producto = await Producto.create({ codigo, nombre, descripcion, cantidad, modeloProductoId, precio });

    // Si hay imágenes, crearlas y asociarlas
    if (req.files && req.files.length > 0) {
      const imagenes = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        descripcion: nombre,
        productoId: producto.id,
        es_principal: index === 0 // La primera es principal por defecto
      }));
      await Imagen.bulkCreate(imagenes);
    }

    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ include: [{ model: ModeloProducto, as: 'modelo' }, { model: Imagen, as: 'imagenes' }] });
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
    const { modeloProductoId, nombre } = req.body;
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

    // Si hay nuevas imágenes, borrar las anteriores (opcional, según preferencia de negocio) 
    // y crear las nuevas. Por ahora, si sube nuevas, reemplazamos las anteriores.
    // Si hay nuevas imágenes, borrar las anteriores y crear las nuevas.
    if (req.files && req.files.length > 0) {
      await Imagen.destroy({ where: { productoId: id } });
      const imagenes = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        descripcion: nombre || 'Imagen de producto',
        productoId: id,
        es_principal: index === 0 // La primera es principal por defecto
      }));
      await Imagen.bulkCreate(imagenes);
    }

    const productoActualizado = await Producto.findByPk(id, { include: [{ model: Imagen, as: 'imagenes' }] });
    res.json(productoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.exportarStock = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      attributes: ['id', 'codigo', 'nombre', 'cantidad']
    });

    const data = productos.map(p => ({
      ID: p.id,
      Codigo: p.codigo,
      Nombre: p.nombre,
      Cantidad: p.cantidad
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Stock");

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="stock_filomena.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.importarStock = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    let procesados = 0;
    for (const row of data) {
      if (row.ID && row.Cantidad !== undefined) {
        await Producto.update({ cantidad: row.Cantidad }, { where: { id: row.ID } });
        procesados++;
      } else if (row.Codigo && row.Cantidad !== undefined) {
        await Producto.update({ cantidad: row.Cantidad }, { where: { codigo: row.Codigo } });
        procesados++;
      }
    }

    res.json({ mensaje: `Stock actualizado para ${procesados} productos` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el archivo Excel' });
  }
};

