const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

async function runTests() {
    console.log('=== Iniciando pruebas de la API ===\n');
    const sfx = Date.now().toString().slice(-6);

    try {
        // 1. Crear Usuario
        console.log('[1/7] Creando usuario...');
        let res = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Juan',
                apellido: 'Perez',
                nombreUsuario: `testadmin_${sfx}`,
                email: `testadmin_${sfx}@test.com`,
                password: 'password123'
            })
        });

        let dbUser = await res.json();
        if (res.status !== 201) {
            console.log('Usuario de prueba ya existe, omitiendo creacion...');
        } else {
            console.log('  -> Usuario creado con id:', dbUser.id);
        }

        // 2. Darle rol admin directamente en DB
        console.log('[2/7] Elevando a administrador en base de datos...');
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        await conn.query(`UPDATE Usuarios SET rol = 'admin' WHERE nombreUsuario = 'testadmin_${sfx}'`);
        await conn.end();
        console.log('  -> Rol actualizado a admin.');

        // 3. Obtener Token (Login)
        console.log('[3/7] Iniciando sesión para obtener Token...');
        res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreUsuario: `testadmin_${sfx}`,
                password: 'password123'
            })
        });
        const loginData = await res.json();
        if (res.status !== 200) throw new Error('Error al hacer login: ' + JSON.stringify(loginData));
        const token = loginData.token;
        console.log('  -> Login exitoso, Token obtenido.');

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 4. Crear Tipo de Producto
        console.log('[4/7] Creando TipoProducto...');
        res = await fetch(`${API_URL}/tipoproductos`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                codigo: `TP-${sfx}`,
                nombre: `Cuaderno ${sfx}`,
                descripcion: 'Cuaderno artesanal'
            })
        });
        const tpData = await res.json();
        if (res.status !== 201) throw new Error('Error tipoProd: ' + JSON.stringify(tpData));
        console.log('  -> TipoProducto creado con id:', tpData.id);

        // 5. Crear Modelo de Producto
        console.log('[5/7] Creando ModeloProducto...');
        res = await fetch(`${API_URL}/modeloproductos`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                codigo: `MP-${sfx}`,
                nombre: `A5 Punteado ${sfx}`,
                descripcion: 'Hojas punteadas tamaño A5',
                tipoProductoId: tpData.id
            })
        });
        const mpData = await res.json();
        if (res.status !== 201) throw new Error('Error modeloProd: ' + JSON.stringify(mpData));
        console.log('  -> ModeloProducto creado con id:', mpData.id);

        // 6. Crear Producto
        console.log('[6/7] Creando Producto...');
        res = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                codigo: `P-${sfx}`,
                nombre: `A5 Punteado Tapa Cuero ${sfx}`,
                descripcion: 'Cuaderno premium',
                cantidad: 10,
                modeloProductoId: mpData.id
            })
        });
        const pData = await res.json();
        if (res.status !== 201) throw new Error('Error Prod: ' + JSON.stringify(pData));
        console.log('  -> Producto creado con id:', pData.id);

        // 7. Crear Evento
        console.log('[7/8] Creando Evento...');
        res = await fetch(`${API_URL}/eventos`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                tipo: 'Feria',
                fecha_hora: new Date(Date.now() + 86400000).toISOString(), // mañana
                lugar: 'Plaza Italia, Buenos Aires, Argentina'
            })
        });
        const eventoData = await res.json();
        if (res.status !== 201) throw new Error('Error Evento: ' + JSON.stringify(eventoData));
        console.log('  -> Evento creado con id:', eventoData.id);

        // 8. Crear un Usuario Normal (Para comentar)
        console.log('[8/11] Creando usuario normal...');
        res = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Maria',
                apellido: 'Gomez',
                nombreUsuario: `testuser_${sfx}`,
                email: `testuser_${sfx}@test.com`,
                password: 'password123'
            })
        });
        let normalUser = await res.json();
        if (res.status !== 201) throw new Error('Error al crear usuario normal: ' + JSON.stringify(normalUser));

        // Login usuario normal
        res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario: `testuser_${sfx}`, password: 'password123' })
        });
        const loginDataNormal = await res.json();
        const tokenNormal = loginDataNormal.token;

        // 9. Crear Posteo (Como Admin)
        console.log('[9/11] Creando Posteo (Admin)...');
        fs.writeFileSync(`dummy_post_${sfx}.jpg`, 'fake image post data');
        const postBlob = new Blob([fs.readFileSync(`dummy_post_${sfx}.jpg`)], { type: 'image/jpeg' });
        const formDataPost = new FormData();
        formDataPost.append('titulo', 'Nuevo Taller de Encuadernación');
        formDataPost.append('texto', 'Aprenderemos a realizar encuadernación copta paso a paso.');
        formDataPost.append('imagen', postBlob, `dummy_post_${sfx}.jpg`);

        res = await fetch(`${API_URL}/posteos`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Token de Admin
            body: formDataPost
        });
        const postData = await res.json();
        if (res.status !== 201) throw new Error('Error Posteo: ' + JSON.stringify(postData));
        console.log('  -> Posteo creado con id:', postData.id);
        if (fs.existsSync(`dummy_post_${sfx}.jpg`)) fs.unlinkSync(`dummy_post_${sfx}.jpg`);

        // 10. Agregar Comentario (Como Usuario Normal)
        console.log('[10/11] Agregando Comentario (Usuario Normal)...');
        res = await fetch(`${API_URL}/posteos/${postData.id}/comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenNormal}` // Token de Usuario Normal
            },
            body: JSON.stringify({ texto: '¡Qué buena noticia! Me anoto.' })
        });
        const comentarioData = await res.json();
        if (res.status !== 201) throw new Error('Error Comentario: ' + JSON.stringify(comentarioData));
        console.log('  -> Comentario agregado con id:', comentarioData.id);

        // 11. Subir y Listar Imagenes
        console.log('[11/11] Subiendo Imagen...');
        fs.writeFileSync(`dummy_${sfx}.jpg`, 'fake image data');
        const imageBlob = new Blob([fs.readFileSync(`dummy_${sfx}.jpg`)], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('productoId', pData.id.toString());
        formData.append('descripcion', 'Imagen de prueba');
        formData.append('imagen', imageBlob, `dummy_${sfx}.jpg`);

        res = await fetch(`${API_URL}/imagenes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const imgData = await res.json();
        if (res.status !== 201) throw new Error('Error Img: ' + JSON.stringify(imgData));
        console.log('  -> Imagen subida con éxito:', imgData.imagen ? imgData.imagen.url : JSON.stringify(imgData));
        if (fs.existsSync(`dummy_${sfx}.jpg`)) fs.unlinkSync(`dummy_${sfx}.jpg`);

        console.log('\n=== ¡Todas las pruebas finalizaron con éxito! ===');

    } catch (error) {
        if (fs.existsSync(`dummy_${sfx}.jpg`)) fs.unlinkSync(`dummy_${sfx}.jpg`);
        console.error('\n[X] Error durante las pruebas:', error.message);
    }
}

setTimeout(runTests, 1000);
