
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

    // Carga inicial
    loadData('productos');
});

// Función para cargar datos según la pestaña activa
async function loadData(entity) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/${entity}`, {
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
            row += `<td style="padding: 1rem;">${item.codigo}</td>
                    <td style="padding: 1rem;">${item.nombre}</td>
                    <td style="padding: 1rem;">${item.cantidad}</td>`;
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

        row += `
            <td style="padding: 1rem; text-align: right;">
                ${entity === 'usuarios' ? `
                    <button class="btn-action btn-edit" onclick="toggleUserStatus(${item.id})">${item.suspendido ? 'Activar' : 'Suspender'}</button>
                ` : ''}
                <button class="btn-action btn-delete" onclick="deleteItem('${entity}', ${item.id})">Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

async function deleteItem(entity, id) {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/${entity}/${id}`, {
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
function openModal(entity) {
    const modal = document.getElementById('admin-modal');
    const fields = document.getElementById('form-fields');
    const title = document.getElementById('modal-title');

    title.innerText = `Agregar ${entity}`;
    fields.innerHTML = '';

    if (entity === 'usuario') {
        fields.innerHTML = `
            <input type="text" name="nombre" placeholder="Nombre" required class="admin-input">
            <input type="text" name="apellido" placeholder="Apellido" required class="admin-input">
            <input type="text" name="nombreUsuario" placeholder="Username" required class="admin-input">
            <input type="email" name="email" placeholder="Email" required class="admin-input">
            <input type="password" name="password" placeholder="Password" required class="admin-input">
            <select name="rol" class="admin-input">
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
            </select>
        `;
    } else if (entity === 'evento') {
        fields.innerHTML = `
            <input type="text" name="tipo" placeholder="Tipo de Evento" required class="admin-input">
            <input type="datetime-local" name="fecha_hora" required class="admin-input">
            <input type="text" name="lugar" placeholder="Lugar" required class="admin-input">
       `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

// Global scope for onclick
window.deleteItem = deleteItem;
window.toggleUserStatus = toggleUserStatus;
window.openModal = openModal;
window.closeModal = closeModal;
