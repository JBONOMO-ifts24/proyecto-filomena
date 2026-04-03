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
        let categorias = await TipoProducto.findAll({
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

        // Filtrar modelos que tengan productos asociados
        categorias = categorias.map(categoria => {
            categoria.modelos = categoria.modelos.filter(
                modelo => modelo.productos && modelo.productos.length > 0
            );
            return categoria;
        });

        // Filtrar categorías que tengan modelos después del filtrado anterior
        categorias = categorias.filter(categoria => categoria.modelos.length > 0);

        // Renderizar la vista pasando las categorias obtenidas de la base de datos
        res.render('catalogo', { categorias });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el catálogo');
    }
});

// Ruta detalle del producto
router.get('/producto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: [
                {
                    model: Imagen,
                    as: 'imagenes'
                },
                {
                    model: ModeloProducto,
                    as: 'modelo',
                    include: [{ model: TipoProducto, as: 'tipo_producto' }]
                }
            ]
        });

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('producto_detalle', { producto });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el detalle del producto');
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
                { model: Usuario, as: 'autor', attributes: ['nombre', 'apellido', 'nombreUsuario'] },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido', 'nombreUsuario', 'id'] }]
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
            include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'nombreUsuario'] }],
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

// Ruta de Registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta del Perfil
router.get('/perfil', (req, res) => {
    res.render('perfil');
});

// Ruta del Carrito
router.get('/carrito', (req, res) => {
    res.render('carrito');
});

module.exports = router;
