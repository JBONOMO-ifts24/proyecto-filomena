const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;

            // Buscar si ya existe por googleId o por email
            let usuario = await Usuario.findOne({ where: { googleId } });

            if (!usuario) {
                usuario = await Usuario.findOne({ where: { email } });
                if (usuario) {
                    // Si el usuario existe por email pero no tenía googleId, lo vinculamos
                    usuario.googleId = googleId;
                    await usuario.save();
                } else {
                    // Crear nuevo usuario (rol forzado a 'usuario')
                    usuario = await Usuario.create({
                        nombre: profile.name.givenName || 'Google',
                        apellido: profile.name.familyName || 'User',
                        nombreUsuario: `user_${googleId.substring(0, 8)}`, // Fallback de username
                        email: email,
                        googleId: googleId,
                        rol: 'usuario'
                    });
                }
            }

            return done(null, usuario);
        } catch (err) {
            return done(err, null);
        }
    }
));

module.exports = passport;
