
# Filomena Arte y Diseño
Página web y API para emprendimiento dedicado al arte, diseño y encuadernación artesanal.

## 🚀 Características
- **Backend Robusto:** Desarrollado con Node.js, Express y Sequelize (MySQL).
- **Consumo de API Seguro:** Autenticación basada en JSON Web Tokens (JWT) con roles diferenciados (`usuario` y `admin`).
- **Frontend Dinámico:** Renderizado del lado del servidor utilizando el motor de plantillas **Nunjucks**.
- **Diseño Premium:** Interfaz de usuario con estética *Glassmorphism*, moderna y responsive.
- **Gestión de Contenidos:**
  - **Catálogo:** Visualización jerárquica de productos agrupados por categorías y modelos.
  - **Eventos:** Gestión y visualización de ferias y talleres (con integración a Google Maps).
  - **Blog/Posteos:** Sistema de publicaciones del administrador con capacidad de comentarios para usuarios.
  - **Muro de Mensajes:** Página de contacto con muro público donde cualquier usuario (invitado o registrado) puede participar.
  - **Imágenes:** Carga y gestión de archivos multimedia mediante Multer.

## 🛠️ Tecnologías
- **Core:** Node.js, Express
- **Base de Datos:** MySQL via Sequelize ORM
- **Vistas:** Nunjucks (con filtros personalizados como `dayjs` para fechas)
- **Seguridad:** Bcryptjs (hashing de contraseñas), JWT (sesiones)
- **Estilo:** CSS Vanilla (Custom Properties, Glassmorphism, Micro-animaciones)

## 📁 Estructura de Carpetas
- `models/` — Definición de entidades (Usuario, Producto, Posteo, Evento, etc.)
- `controllers/` — Lógica de negocio (auth, productos, posteos, eventos)
- `routes/` — Rutas para la API (`/api/*`) y para las vistas del Frontend (`/`)
- `views/` — Plantillas Nunjucks (`.njk`) y Layout principal
- `public/` — Archivos estáticos: CSS, JS cliente (auth logic) e Imágenes del front
- `uploads/` — Almacenamiento de imágenes subidas por Multer
- `db/` — Configuración de conexión Sequelize

## ⚙️ Instalación y Configuración
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` (basado en `.env.template` si existe):
   ```env
   DB_NAME=proyecto_filomena
   DB_USER=juancho
   DB_PASS=trapito1982
   DB_HOST=localhost
   DB_DIALECT=mysql
   JWT_SECRET=tu_clave_secreta
   ```
4. Sincroniza la estructura de la base de datos:
   ```bash
   node sync.js
   ```
5. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🔐 API & Seguridad
- **JWT Fix:** Se corrigió un bug crítico donde el token no incluía el rol del usuario, impidiendo la validación de administradores. Ahora el payload contiene `{ id, nombreUsuario, rol }`.
- **Endpoints Protegidos:** Solo los usuarios con rol `admin` pueden crear eventos, productos o eliminar comentarios.
- **Rutas Principales:**
  - `POST /api/login`: Genera el token de acceso.
  - `GET /catalogo`: Vista pública de productos.
  - `GET /eventos`: Vista pública de próximos eventos.
  - `POST /api/posteos/:id/comentarios`: Permite a cualquier usuario registrado comentar.

---
*Filomena Arte y Diseño - Pasión por la encuadernación artesanal.*
