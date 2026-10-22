const Evento = require('../models/Evento');

const RECURRENCIA_LABELS = {
    ninguna: 'Evento único',
    diaria: 'Diario',
    semanal: 'Semanal',
    quincenal: 'Quincenal',
    mensual: 'Mensual'
};

const sumarRecurrencia = (fecha, recurrencia) => {
    const nuevaFecha = new Date(fecha);

    switch (recurrencia) {
        case 'diaria':
            nuevaFecha.setDate(nuevaFecha.getDate() + 1);
            break;
        case 'semanal':
            nuevaFecha.setDate(nuevaFecha.getDate() + 7);
            break;
        case 'quincenal':
            nuevaFecha.setDate(nuevaFecha.getDate() + 14);
            break;
        case 'mensual':
            nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
            break;
        default:
            return null;
    }

    return nuevaFecha;
};

const expandirEventosRecurrencia = (eventos, limite = 12) => {
    const ahora = new Date();
    const inicioDelDia = new Date(ahora);
    inicioDelDia.setHours(0, 0, 0, 0);

    return eventos.flatMap((evento) => {
        const datos = evento.toJSON ? evento.toJSON() : { ...evento };
        const recurrencia = datos.recurrencia || 'ninguna';
        const etiqueta = RECURRENCIA_LABELS[recurrencia] || 'Evento único';

        if (!datos.fecha_hora) {
            return [];
        }

        const fechaEvento = new Date(datos.fecha_hora);
        if (Number.isNaN(fechaEvento.getTime())) {
            return [];
        }

        if (!recurrencia || recurrencia === 'ninguna') {
            return fechaEvento >= inicioDelDia ? [{ ...datos, recurrencia_label: etiqueta }] : [];
        }

        const instancias = [];
        let fechaActual = new Date(fechaEvento);
        let ciclos = 0;

        while (fechaActual < inicioDelDia && ciclos < 200) {
            const siguiente = sumarRecurrencia(fechaActual, recurrencia);
            if (!siguiente) break;
            fechaActual = siguiente;
            ciclos += 1;
        }

        while (instancias.length < limite && ciclos < 500) {
            if (fechaActual >= inicioDelDia) {
                instancias.push({
                    ...datos,
                    fecha_hora: fechaActual.toISOString(),
                    recurrencia_label: etiqueta,
                    es_instancia_recurrente: true
                });
            }

            const siguiente = sumarRecurrencia(fechaActual, recurrencia);
            if (!siguiente) break;
            fechaActual = siguiente;
            ciclos += 1;
        }

        return instancias;
    });
};

exports.expandirEventosRecurrencia = expandirEventosRecurrencia;

// Crear evento (solo admin)
exports.crearEvento = async (req, res) => {
    try {
        const { tipo, recurrencia, fecha_hora, lugar, descripcion, googleMapsUrl } = req.body;
        const evento = await Evento.create({
            tipo,
            recurrencia: recurrencia || 'ninguna',
            fecha_hora,
            lugar,
            descripcion,
            googleMapsUrl,
            usuarioId: req.user.id // Extraído del token via middleware auth
        });
        res.status(201).json(evento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar eventos (público o requerido auth dependiendo de la config global, aquí lo haremos por defecto)
exports.listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            order: [['fecha_hora', 'ASC']]
        });
        res.json(expandirEventosRecurrencia(eventos));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modificar evento (solo admin)
exports.modificarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, recurrencia, fecha_hora, lugar, descripcion, googleMapsUrl } = req.body;

        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        await evento.update({
            tipo,
            recurrencia: recurrencia || 'ninguna',
            fecha_hora,
            lugar,
            descripcion,
            googleMapsUrl
        });
        res.json(evento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar evento (solo admin)
exports.eliminarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        await evento.destroy();
        res.json({ mensaje: 'Evento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
