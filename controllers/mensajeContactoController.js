const MensajeContacto = require('../models/MensajeContacto');
const Usuario = require('../models/Usuario');

exports.crearMensaje = async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;
        let finalNombre = nombre;
        let finalEmail = email;
        const usuarioId = req.user ? req.user.id : null;

        if (req.user) {
            finalNombre = req.user.nombreUsuario;
            finalEmail = req.user.email;
        }

        const nuevoMensaje = await MensajeContacto.create({
            nombre: finalNombre,
            email: finalEmail,
            mensaje,
            usuarioId
        });

        res.status(201).json(nuevoMensaje);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listarMensajes = async (req, res) => {
    try {
        const mensajes = await MensajeContacto.findAll({
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombreUsuario']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(mensajes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const mensaje = await MensajeContacto.findByPk(id);

        if (!mensaje) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        // Autorización: creador del mensaje o admin
        if (req.user.rol !== 'admin' && mensaje.usuarioId !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este mensaje' });
        }

        await mensaje.destroy();
        res.json({ mensaje: 'Mensaje eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
