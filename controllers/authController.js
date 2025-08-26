
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { nombreUsuario, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { nombreUsuario } });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, nombreUsuario: usuario.nombreUsuario, email: usuario.email },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );
    res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombreUsuario: usuario.nombreUsuario, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
