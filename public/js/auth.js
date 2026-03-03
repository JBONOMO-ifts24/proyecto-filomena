document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('nav-login-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');

    // Manejo de la Navegación (Mostrar/Ocultar Login vs Logout)
    const adminLink = document.getElementById('nav-admin-link');

    if (token) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';

        // Decodificar rol (JWT es base64 en la segunda parte)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.rol === 'admin') {
                if (adminLink) adminLink.style.display = 'inline-block';
            }
        } catch (e) { console.error("Error al decodificar token", e); }

    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }

    // Acción de Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            // Redirigir al inicio o recargar la página
            window.location.href = '/';
        });
    }

    // Lógica para mostrar formularios de comentarios si está logueado
    const commentForms = document.querySelectorAll('.comment-form-container');
    const loginPrompts = document.querySelectorAll('.login-prompt');

    if (token) {
        commentForms.forEach(form => form.style.display = 'block');
        loginPrompts.forEach(prompt => prompt.style.display = 'none');
    } else {
        commentForms.forEach(form => form.style.display = 'none');
        loginPrompts.forEach(prompt => prompt.style.display = 'block');
    }

    // Lógica de envío de comentarios
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            const container = form.closest('.comment-form-container');
            const postId = container.getAttribute('data-post-id');
            const textarea = form.querySelector('textarea');
            const texto = textarea.value;

            if (!texto.trim()) return;

            try {
                const response = await fetch(`/api/posteos/${postId}/comentarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ texto })
                });

                if (response.ok) {
                    // Limpiar formulario y recargar para ver el comentario (o inyectar dinámicamente)
                    textarea.value = '';
                    location.reload();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Error al enviar comentario');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        });
    });

    // Lógica para el Muro de Contacto
    const contactForm = document.getElementById('contact-wall-form');
    if (contactForm) {
        const guestFields = document.getElementById('guest-fields');
        const nombreInput = document.getElementById('contact-nombre');
        const emailInput = document.getElementById('contact-email');

        if (token) {
            if (guestFields) guestFields.style.display = 'none';
            nombreInput.required = false;
            emailInput.required = false;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mensaje = document.getElementById('contact-mensaje').value;
            const payload = { mensaje };

            if (!token) {
                payload.nombre = nombreInput.value;
                payload.email = emailInput.value;
            } else {
                payload.nombre = "Usuario Registrado";
                payload.email = "registrado@filomena.com";
            }

            try {
                const response = await fetch('/api/mensajes-contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    location.reload();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Error al enviar mensaje');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        });
    }

    // Lógica para el Formulario de Login (Si existe en la vista actual)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombreUsuario = document.getElementById('nombreUsuario').value;
            const password = document.getElementById('password').value;
            const alertBox = document.getElementById('login-alert');

            try {
                // Petición a nuestra API Backend
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombreUsuario, password })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    // Guardar token en el navegador
                    localStorage.setItem('token', data.token);
                    alertBox.style.display = 'none';
                    // Redirigir al inicio exitosamente
                    window.location.href = '/';
                } else {
                    // Mostrar error visual
                    alertBox.textContent = data.error || data.mensaje || 'Error al iniciar sesión';
                    alertBox.className = 'alert error';
                }
            } catch (err) {
                alertBox.textContent = 'Error de conexión con el servidor.';
                alertBox.className = 'alert error';
            }
        });
    }
});
