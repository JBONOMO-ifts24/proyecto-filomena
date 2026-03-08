
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const dashboard = document.getElementById('admin-dashboard');
    const unauthorized = document.getElementById('unauthorized-message');

    if (!token) {
        unauthorized.style.display = 'block';
        return;
    }

    // Verificar Rol Admin en el cliente
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.rol !== 'admin') {
            unauthorized.style.display = 'block';
            return;
        }
    } catch (e) {
        unauthorized.style.display = 'block';
        return;
    }

    // Si es admin, mostrar dashboard
    dashboard.style.display = 'block';

    // Lógica de Pestañas (Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');

            btn.classList.add('active');
            document.getElementById(`${target}-section`).style.display = 'block';

            loadData(target);
        });
    });

    // Lógica de Formulario Admin (Creación/Edición)
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(adminForm);
            const data = Object.fromEntries(formData.entries());
            const entity = adminForm.getAttribute('data-entity');
            const mode = adminForm.getAttribute('data-mode');
            const id = adminForm.getAttribute('data-id');
            const token = localStorage.getItem('token');

            if (entity === 'usuario') {
                data.suspendido = formData.has('suspendido');
            }

            if (data.precio === '') {
                data.precio = null;
            }

            let url = `/api/${entity}s`;

            let method = mode === 'edit' ? 'PUT' : 'POST';

            // Ajuste de URLs para entidades especiales
            if (entity === 'usuario') {
                url = id ? `/api/usuarios/${id}` : '/api/admin/usuarios'; // Ajustado para edición de usuario
            } else if (entity === 'modeloproducto') {
                url = '/api/modeloproductos';
            } else if (entity === 'tipoproducto') {
                url = '/api/tipoproductos';
            }

            if (mode === 'edit' && entity !== 'usuario') {
                url += `/${id}`;
            }

            // Si es multipart (con archivos), usar FormData directamente
            let body = JSON.stringify(data);
            let headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Posteos y Productos pueden tener imágenes (Usar FormData)
            if (entity === 'posteo' || entity === 'producto') {
                delete headers['Content-Type']; // Dejar que el navegador ponga el boundary
                body = formData;
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body
                });


                if (response.ok) {
                    closeModal();
                    // Refresh de tabla según la entidad
                    if (entity === 'usuario') loadData('usuarios');
                    else if (entity === 'modeloproducto') loadData('modelos');
                    else if (entity === 'tipoproducto') loadData('tipos');
                    else loadData(entity + 's'); // Refresh table
                } else {
                    const result = await response.json();
                    alert(result.error || 'Error en la operación');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        });
    }

    // Carga inicial
    loadData('productos');
});

// Función para cargar datos según la pestaña activa
async function loadData(entity) {
    const token = localStorage.getItem('token');
    // Mapeo de nombres de pestaña a endpoints reales de la API
    const apiPathMap = { modelos: 'modeloproductos', tipos: 'tipoproductos' };
    const apiPath = apiPathMap[entity] || entity;
    try {
        const response = await fetch(`/api/${apiPath}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        renderTable(entity, data);
    } catch (err) {
        console.error(`Error cargando ${entity}:`, err);
    }
}

function renderTable(entity, data) {
    const tbody = document.getElementById(`${entity}-table-body`);
    tbody.innerHTML = '';

    data.forEach(item => {
        let row = '<tr>';
        if (entity === 'productos') {
            const precioStr = item.precio ? `$${item.precio}` : '-';
            row += `<td style="padding: 1rem;">${item.codigo}</td>
                    <td style="padding: 1rem;">${item.nombre}</td>
                    <td style="padding: 1rem;">${item.cantidad}</td>
                    <td style="padding: 1rem;">${precioStr}</td>`;
        } else if (entity === 'modelos') {
            const tipoNombre = item.tipo_producto ? item.tipo_producto.nombre : '-';
            row += `<td style="padding: 1rem;">${item.codigo}</td>
                    <td style="padding: 1rem;">${item.nombre}</td>
                    <td style="padding: 1rem;">${tipoNombre}</td>`;
        } else if (entity === 'tipos') {
            row += `<td style="padding: 1rem;">${item.nombre}</td>
                    <td style="padding: 1rem;">${item.descripcion || '-'}</td>`;
        } else if (entity === 'eventos') {
            row += `<td style="padding: 1rem;">${item.tipo}</td>
                    <td style="padding: 1rem;">${new Date(item.fecha_hora).toLocaleDateString()}</td>
                    <td style="padding: 1rem;">${item.lugar}</td>`;
        } else if (entity === 'posteos') {
            row += `<td style="padding: 1rem;">${item.titulo}</td>
                    <td style="padding: 1rem;">${new Date(item.createdAt).toLocaleDateString()}</td>`;
        } else if (entity === 'usuarios') {
            row += `<td style="padding: 1rem;">${item.nombreUsuario}</td>
                    <td style="padding: 1rem;">${item.email}</td>
                    <td style="padding: 1rem;">${item.rol}</td>
                    <td style="padding: 1rem;">${item.suspendido ? '<span style="color:red">Suspendido</span>' : '<span style="color:green">Activo</span>'}</td>`;
        }

        const singularMap = {
            productos: 'producto',
            modelos: 'modeloproducto',
            tipos: 'tipoproducto',
            eventos: 'evento',
            posteos: 'posteo',
            usuarios: 'usuario'
        };
        const singularEntity = singularMap[entity] || entity;

        row += `
            <td style="padding: 1rem; text-align: right;">
                <button class="btn-action btn-edit" onclick="openModal('${singularEntity}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">Editar</button>
                <button class="btn-action btn-delete" onclick="deleteItem('${entity}', ${item.id})">Eliminar</button>
            </td>
        </tr>`;


        tbody.innerHTML += row;
    });
}

async function deleteItem(entity, id) {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    const token = localStorage.getItem('token');
    // Mapeo de nombres de pestaña a endpoints reales de la API
    const apiPathMap = { modelos: 'modeloproductos', tipos: 'tipoproductos' };
    const apiPath = apiPathMap[entity] || entity;
    try {
        const response = await fetch(`/api/${apiPath}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadData(entity);
        } else {
            alert('Error al eliminar');
        }
    } catch (err) {
        console.error(err);
    }
}

async function toggleUserStatus(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/usuarios/${id}/suspender`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadData('usuarios');
        }
    } catch (err) {
        console.error(err);
    }
}

// Modal Logic
function openModal(entity, item = null) {
    const modal = document.getElementById('admin-modal');
    const fields = document.getElementById('form-fields');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('admin-form');

    form.setAttribute('data-entity', entity);
    form.setAttribute('data-mode', item ? 'edit' : 'create');
    form.setAttribute('data-id', item ? item.id : '');

    title.innerText = item ? `Editar ${entity}` : `Agregar ${entity}`;
    fields.innerHTML = '';

    if (entity === 'usuario') {
        fields.innerHTML = `
            <input type="text" name="nombre" placeholder="Nombre" required class="admin-input" value="${item ? item.nombre : ''}">
            <input type="text" name="apellido" placeholder="Apellido" required class="admin-input" value="${item ? item.apellido : ''}">
            <input type="text" name="nombreUsuario" placeholder="Username" required class="admin-input" value="${item ? item.nombreUsuario : ''}">
            <input type="email" name="email" placeholder="Email" required class="admin-input" value="${item ? item.email : ''}">
            <input type="password" name="password" placeholder="Password (dejar vacío para mantener)" class="admin-input">
            <select name="rol" class="admin-input">
                <option value="usuario" ${item && item.rol === 'usuario' ? 'selected' : ''}>Usuario</option>
                <option value="admin" ${item && item.rol === 'admin' ? 'selected' : ''}>Administrador</option>
            </select>
            ${item ? `<label><input type="checkbox" name="suspendido" ${item.suspendido ? 'checked' : ''}> Suspendido</label>` : ''}
        `;
    } else if (entity === 'evento') {
        const fecha = item ? new Date(item.fecha_hora).toISOString().slice(0, 16) : '';
        fields.innerHTML = `
            <input type="text" name="tipo" placeholder="Tipo de Evento" required class="admin-input" value="${item ? item.tipo : ''}">
            <input type="datetime-local" name="fecha_hora" required class="admin-input" value="${fecha}">
            <input type="text" name="lugar" placeholder="Lugar" required class="admin-input" value="${item ? item.lugar : ''}">
            <input type="text" name="googleMapsUrl" placeholder="Enlace / Coordenadas Google Maps (Opcional)" class="admin-input" value="${item ? item.googleMapsUrl || '' : ''}">
            <textarea name="descripcion" placeholder="Descripción del evento" class="admin-input" style="min-height: 100px;">${item ? item.descripcion : ''}</textarea>
       `;
    } else if (entity === 'posteo') {
        fields.innerHTML = `
            <input type="text" name="titulo" placeholder="Título" required class="admin-input" value="${item ? item.titulo : ''}">
            <textarea name="texto" placeholder="Texto del posteo" required class="admin-input" style="min-height: 100px;">${item ? item.texto : ''}</textarea>
            <label style="display: block; margin-top: 1rem;">Imagen ${item ? '(Opcional/Nueva)' : ''}:</label>
            <input type="file" name="imagen" class="admin-input">
        `;
    } else if (entity === 'producto') {
        const token = localStorage.getItem('token');
        fields.innerHTML = `
            <input type="text" name="nombre" placeholder="Nombre" required class="admin-input" value="${item ? item.nombre : ''}">
            <textarea name="descripcion" placeholder="Descripción" class="admin-input">${item ? item.descripcion || '' : ''}</textarea>
            <input type="number" name="cantidad" placeholder="Cantidad" required class="admin-input" value="${item ? item.cantidad : ''}">
            <input type="number" name="precio" placeholder="Precio (Opcional)" step="0.01" class="admin-input" value="${item ? item.precio || '' : ''}">
            <select name="modeloProductoId" required class="admin-input" id="select-modelo">
                <option value="">Cargando modelos...</option>
            </select>
            <label style="display: block; margin-top: 1rem;">Imágenes (Máx. 3):</label>
            <input type="file" name="imagenes" class="admin-input" multiple accept="image/*">
            <small style="color: var(--text-light); display: block; margin-bottom: 1rem;">Si seleccionas nuevas, se reemplazarán las anteriores.</small>
        `;
        fetch('/api/modeloproductos', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(modelos => {
                const sel = document.getElementById('select-modelo');
                sel.innerHTML = '<option value="">-- Seleccionar Modelo --</option>';
                modelos.forEach(m => {
                    const selected = item && item.modeloProductoId === m.id ? 'selected' : '';
                    sel.innerHTML += `<option value="${m.id}" ${selected}>${m.nombre}</option>`;
                });
            })
            .catch(() => {
                document.getElementById('select-modelo').innerHTML = '<option value="">Error al cargar modelos</option>';
            });

        // Mostrar imágenes actuales si es edición
        if (item && item.imagenes && item.imagenes.length > 0) {
            const imgContainer = document.createElement('div');
            imgContainer.style.marginTop = '1rem';
            imgContainer.innerHTML = '<label style="display: block; margin-bottom: 0.5rem;">Imágenes actuales:</label>';
            const gallery = document.createElement('div');
            gallery.style.display = 'flex';
            gallery.style.gap = '10px';
            gallery.style.flexWrap = 'wrap';

            item.imagenes.forEach(img => {
                const imgDiv = document.createElement('div');
                imgDiv.style.position = 'relative';
                imgDiv.style.width = '80px';
                imgDiv.style.height = '80px';
                imgDiv.style.borderRadius = '8px';
                imgDiv.style.overflow = 'hidden';
                imgDiv.style.border = img.es_principal ? '3px solid var(--accent-color)' : '1px solid var(--glass-border)';

                imgDiv.innerHTML = `
                    <img src="${img.url}" style="width: 100%; height: 100%; object-fit: cover;">
                    ${img.es_principal ?
                        '<span style="position: absolute; top: 2px; right: 2px; background: var(--accent-color); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px;">★</span>' :
                        `<button type="button" onclick="setPrincipalImage(${img.id}, ${item.id})" style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 4px; padding: 2px 5px; font-size: 8px; cursor: pointer;">Principal</button>`
                    }
                `;
                gallery.appendChild(imgDiv);
            });
            imgContainer.appendChild(gallery);
            fields.appendChild(imgContainer);
        }
    } else if (entity === 'tipoproducto') {
        fields.innerHTML = `
            <input type="text" name="nombre" placeholder="Nombre del Tipo" required class="admin-input" value="${item ? item.nombre : ''}">
            <textarea name="descripcion" placeholder="Descripción" class="admin-input">${item ? item.descripcion || '' : ''}</textarea>
        `;
    } else if (entity === 'modeloproducto') {
        const token = localStorage.getItem('token');
        fields.innerHTML = `
            <input type="text" name="nombre" placeholder="Nombre" required class="admin-input" value="${item ? item.nombre : ''}">
            <textarea name="descripcion" placeholder="Descripción" class="admin-input">${item ? item.descripcion || '' : ''}</textarea>
            <select name="tipoProductoId" required class="admin-input" id="select-tipo">
                <option value="">Cargando tipos...</option>
            </select>
        `;
        fetch('/api/tipoproductos', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(tipos => {
                const sel = document.getElementById('select-tipo');
                sel.innerHTML = '<option value="">-- Seleccionar Tipo --</option>';
                tipos.forEach(t => {
                    const selected = item && item.tipoProductoId === t.id ? 'selected' : '';
                    sel.innerHTML += `<option value="${t.id}" ${selected}>${t.nombre}</option>`;
                });
            })
            .catch(() => {
                document.getElementById('select-tipo').innerHTML = '<option value="">Error al cargar tipos</option>';
            });
    }

    modal.style.display = 'flex';
}


function closeModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

async function setPrincipalImage(imageId, productoId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/imagenes/${imageId}/principal`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            // Recargar datos para ver el cambio en el modal (o cerrar y recargar tabla)
            // Por simplicidad, recargamos la tabla y cerramos el modal
            closeModal();
            loadData('productos');
        } else {
            alert('Error al establecer imagen principal');
        }
    } catch (err) {
        console.error(err);
    }
}

// Global scope for onclick
window.deleteItem = deleteItem;
window.toggleUserStatus = toggleUserStatus;
window.openModal = openModal;
window.closeModal = closeModal;
window.setPrincipalImage = setPrincipalImage;
