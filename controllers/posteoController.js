const Posteo = require('../models/Posteo');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');

const normalizeYoutubeUrl = (youtubeUrl) => {
    if (!youtubeUrl) return null;

    const trimmed = youtubeUrl.trim();
    if (!trimmed) return null;

    try {
        const url = new URL(trimmed);

        if (url.hostname.includes('youtube.com')) {
            const videoId = url.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/);
            if (shortsMatch && shortsMatch[1]) {
                return `https://www.youtube.com/embed/${shortsMatch[1]}`;
            }
        }

        if (url.hostname.includes('youtu.be')) {
            const videoId = url.pathname.replace('/', '').split('/')[0];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (trimmed.includes('youtube.com/embed/')) {
            return trimmed;
        }
    } catch (err) {
        return null;
    }

    return null;
};

exports.crearPosteo = async (req, res) => {
    try {
        const { titulo, texto, youtube_url } = req.body;
        const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`).slice(0, 3);

        const normalizedYoutubeUrl = normalizeYoutubeUrl(youtube_url);
        if (youtube_url && !normalizedYoutubeUrl) {
            return res.status(400).json({ error: 'URL de YouTube inválida' });
        }

        const posteo = await Posteo.create({
            titulo,
            texto,
            imagen: uploadedImages[0] || null,
            imagenes: uploadedImages,
            youtube_url: normalizedYoutubeUrl,
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
        const { titulo, texto, youtube_url } = req.body;

        const posteo = await Posteo.findByPk(id);
        if (!posteo) {
            return res.status(404).json({ error: 'Posteo no encontrado' });
        }

        const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`).slice(0, 3);
        const imagenes = uploadedImages.length > 0
            ? uploadedImages
            : Array.isArray(posteo.imagenes) && posteo.imagenes.length > 0
                ? posteo.imagenes
                : (posteo.imagen ? [posteo.imagen] : []);

        const normalizedYoutubeUrl = youtube_url === '' ? null : normalizeYoutubeUrl(youtube_url);
        if (youtube_url && !normalizedYoutubeUrl) {
            return res.status(400).json({ error: 'URL de YouTube inválida' });
        }

        await posteo.update({
            titulo,
            texto,
            imagen: imagenes[0] || null,
            imagenes,
            youtube_url: normalizedYoutubeUrl
        });

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
                { model: Usuario, as: 'autor', attributes: ['nombre', 'apellido', 'nombreUsuario', 'id'] },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido', 'nombreUsuario', 'id'] }]
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
