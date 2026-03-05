const Posteo = require('../models/Posteo');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');

exports.crearPosteo = async (req, res) => {
    try {
        const { titulo, texto } = req.body;
        let urlImagen = null;

        if (req.file) {
            urlImagen = `/uploads/${req.file.filename}`;
        }

        const posteo = await Posteo.create({
            titulo,
            texto,
            imagen: urlImagen,
            usuarioId: req.user.id
        });

        res.status(201).json(posteo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.modificarPosteo = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, texto } = req.body;
        let updateData = { titulo, texto };

        if (req.file) {
            updateData.imagen = `/uploads/${req.file.filename}`;
        }

        const posteo = await Posteo.findByPk(id);
        if (!posteo) {
            return res.status(404).json({ error: 'Posteo no encontrado' });
        }

        await posteo.update(updateData);
        res.json(posteo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.eliminarPosteo = async (req, res) => {
    try {
        const { id } = req.params;
        const posteo = await Posteo.findByPk(id);

        if (!posteo) {
            return res.status(404).json({ error: 'Posteo no encontrado' });
        }

        await posteo.destroy();
        res.json({ mensaje: 'Posteo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listarPosteos = async (req, res) => {
    try {
        const posteos = await Posteo.findAll({
            include: [
                { model: Usuario, as: 'autor', attributes: ['nombreUsuario', 'id'] },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [{ model: Usuario, as: 'autor', attributes: ['nombreUsuario', 'id'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(posteos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.agregarComentario = async (req, res) => {
    try {
        const { id } = req.params; // Posteo ID
        const { texto } = req.body;

        const posteo = await Posteo.findByPk(id);
        if (!posteo) {
            return res.status(404).json({ error: 'Posteo no encontrado' });
        }

        const comentario = await Comentario.create({
            texto,
            posteoId: id,
            usuarioId: req.user.id
        });

        res.status(201).json(comentario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.eliminarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const comentario = await Comentario.findByPk(id);

        if (!comentario) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        // Verificar autoría o ser admin
        if (comentario.usuarioId !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
        }

        await comentario.destroy();
        res.json({ mensaje: 'Comentario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.modificarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;
        const comentario = await Comentario.findByPk(id);

        if (!comentario) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        // Verificar autoría o ser admin
        if (comentario.usuarioId !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permiso para modificar este comentario' });
        }

        await comentario.update({ texto });
        res.json(comentario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
