document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const form = document.getElementById('perfil-form');
    const alertBox = document.getElementById('perfil-alert');

    // Cargar datos del perfil
    try {
        const res = await fetch('/api/usuarios/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const usuario = await res.json();
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('nombreUsuario').value = usuario.nombreUsuario;
            document.getElementById('email').value = usuario.email;
            form.style.display = 'block'; // Mostrar el formulario
        } else {
            alertBox.textContent = 'Error al cargar los datos del perfil.';
            alertBox.className = 'alert error';
            alertBox.style.display = 'block';
        }
    } catch (err) {
        alertBox.textContent = 'Error de conexión.';
        alertBox.className = 'alert error';
        alertBox.style.display = 'block';
    }

    // Actualizar perfil
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const password = document.getElementById('password').value;

        const data = { nombre, apellido, nombreUsuario };
        if (password) {
            data.password = password;
        }

        try {
            const res = await fetch('/api/usuarios/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                // To apply the username change securely, we might need a new token, but for UX simplicity we alert and reload.
                alertBox.textContent = 'Perfil actualizado exitosamente.';
                alertBox.className = 'alert success';
                alertBox.style.display = 'block';
                document.getElementById('password').value = '';
                
                // Si el usuario cambia su nombre de usuario, el JWT guardado quedará desactualizado visualmente.
                // Opcional: Podríamos emitir un nuevo JWT desde el backend en el PUT, pero por ahora recargar.
                setTimeout(() => location.reload(), 1500);
            } else {
                alertBox.textContent = result.error || 'Error al actualizar el perfil.';
                alertBox.className = 'alert error';
                alertBox.style.display = 'block';
            }
        } catch (err) {
            alertBox.textContent = 'Error de conexión.';
            alertBox.className = 'alert error';
            alertBox.style.display = 'block';
        }
    });
});
