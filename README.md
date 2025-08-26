
# proyecto-filomena
Página para comercio dedicado a la encuadernación.

## Backend Node.js

Este proyecto incluye un backend desarrollado con Node.js, Express y Sequelize, usando MySQL como base de datos y autenticación JWT.

### Funcionalidades principales
- API REST para gestión de usuarios (registro y login seguro con contraseña hasheada).
- Autenticación con JWT para proteger rutas.
- Modelos y conexión a base de datos organizados en carpetas (`models`, `db`, `controllers`, `routes`, `middleware`).

### Estructura de carpetas
- `models/` — Modelos Sequelize (ej: Usuario)
- `db/` — Conexión a la base de datos (usando variables de entorno)
- `controllers/` — Lógica de negocio y controladores
- `routes/` — Definición de rutas Express
- `middleware/` — Middlewares personalizados (ej: autenticación JWT)

### Instalación y configuración
1. Clona el repositorio y entra a la carpeta del proyecto.
2. Instala las dependencias:
	```
	npm install
	```
3. Crea un archivo `.env` con los siguientes datos (ajusta según tu entorno):
	```
	DB_NAME=nombre_base
	DB_USER=usuario
	DB_PASS=contraseña
	DB_HOST=localhost
	DB_DIALECT=mysql
	JWT_SECRET=tu_clave_secreta_super_segura
	```
4. Sincroniza la base de datos (¡esto borra los datos existentes!):
	```
	node sync.js
	```
	Luego elimina el archivo `sync.js`.
5. Inicia el servidor:
	```
	npm run dev
	```

### Endpoints principales
- `POST /api/usuarios` — Crear usuario (campos: nombre, apellido, nombreUsuario, email, password)
- `POST /api/login` — Login (campos: nombreUsuario, password). Devuelve un token JWT.
- `GET /api/usuarios` — Listar usuarios (requiere token JWT en header Authorization)

### Seguridad
- Las contraseñas se almacenan hasheadas con bcryptjs.
- El acceso a rutas protegidas requiere un token JWT válido.
- Los datos sensibles y claves están en `.env` (excluido de git por `.gitignore`).

---

La página va a tener la información del stock de los productos realizados en el emprendimiento. El stock va a poder tener una integración para poder modificar el stock desde planillas tipo excel.
Además del stock, la webpage va a tener un apartado donde se van a mostrar conocimientos y técnicas referidas a los productos realizados en el emprendimiento.
