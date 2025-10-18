const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader); // debug
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proveído' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ error: 'Token no proveído' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('JWT payload:', payload);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const adminOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header (adminOnly):', authHeader); // debug
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proveído' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ error: 'Token no proveído' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('payload:):', payload);
    if (payload.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol admin' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { verifyToken, adminOnly };
