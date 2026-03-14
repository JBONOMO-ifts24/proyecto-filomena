
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Forzar rol 'usuario' para registros públicos
    const usuario = await Usuario.create({ ...rest, password: hashedPassword, rol: 'usuario', suspendido: false });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Admins pueden crear usuarios con cualquier rol
exports.crearUsuarioAdmin = async (req, res) => {
  try {
    const { password, rol, ...rest } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const usuario = await Usuario.create({ ...rest, password: hashedPassword, rol: rol || 'usuario', suspendido: false });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] } // No enviar contraseñas
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle suspension
exports.toggleSuspenderUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.suspendido = !usuario.suspendido;
    await usuario.save();
    res.json({ mensaje: usuario.suspendido ? 'Usuario suspendido' : 'Usuario activado', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(rest);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
