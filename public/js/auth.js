document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('nav-login-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');

    // Manejo de la Navegación (Mostrar/Ocultar Login vs Logout)
    if (token) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
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
