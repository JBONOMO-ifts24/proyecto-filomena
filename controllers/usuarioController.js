
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ ...rest, password: hashedPassword });
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
