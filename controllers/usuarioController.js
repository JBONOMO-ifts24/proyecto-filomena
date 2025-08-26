
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    // Forzar rol 'usuario' para registros públicos
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ ...rest, password: hashedPassword, rol: 'usuario' });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Solo admin puede suspender usuarios
exports.suspenderUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.suspendido = true;
    await usuario.save();
    res.json({ mensaje: 'Usuario suspendido', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
