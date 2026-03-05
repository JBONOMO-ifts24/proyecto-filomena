const express = require('express');
const { login } = require('../controllers/authController');

const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', login);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generar JWT
        const token = jwt.sign(
            { id: req.user.id, nombreUsuario: req.user.nombreUsuario, email: req.user.email, rol: req.user.rol },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '24h' }
        );

        // Pasar el token al frontend via script inyectado o redirect con query (usaremos redirect con script para guardarlo en localStorage)
        res.send(`
      <script>
        localStorage.setItem('token', '${token}');
        window.location.href = '/';
      </script>
    `);
    }
);

module.exports = router;
