const express = require('express');
const router = express.Router();
const TipoProducto = require('../models/Tipo_Producto');
const ModeloProducto = require('../models/ModeloProducto');
const Producto = require('../models/Producto');
const Imagen = require('../models/Imagen');
const Evento = require('../models/Evento');
const Usuario = require('../models/Usuario');
const Posteo = require('../models/Posteo');
const Comentario = require('../models/Comentario');
const MensajeContacto = require('../models/MensajeContacto');

// Ruta principal (Home)
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta del Catálogo
router.get('/catalogo', async (req, res) => {
    try {
        const categorias = await TipoProducto.findAll({
            include: [{
                model: ModeloProducto,
                as: 'modelos',
                include: [{
                    model: Producto,
                    as: 'productos',
                    include: [{
                        model: Imagen,
                        as: 'imagenes'
                    }]
                }]
            }]
        });

        // Renderizar la vista pasando las categorias obtenidas de la base de datos
        res.render('catalogo', { categorias });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el catálogo');
    }
});

// Ruta de Eventos
router.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            include: [{ model: Usuario, as: 'creador', attributes: ['nombre', 'apellido'] }],
            order: [['fecha_hora', 'ASC']]
        });
        res.render('eventos', { eventos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar los eventos');
    }
});

// Ruta de Blog (Posteos)
router.get('/blog', async (req, res) => {
    try {
        const posteos = await Posteo.findAll({
            include: [
                { model: Usuario, as: 'autor', attributes: ['nombreUsuario'] },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [{ model: Usuario, as: 'autor', attributes: ['nombreUsuario'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('blog', { posteos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el blog');
    }
});

// Ruta de Contacto
router.get('/contacto', async (req, res) => {
    try {
        const mensajes = await MensajeContacto.findAll({
            include: [{ model: Usuario, as: 'usuario', attributes: ['nombreUsuario'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('contacto', { mensajes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar la página de contacto');
    }
});

// Ruta de Admin
router.get('/admin', (req, res) => {
    res.render('admin');
});

// Ruta de Login
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;
