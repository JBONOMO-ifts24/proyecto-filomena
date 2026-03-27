
# Filomena Arte y Diseño
Página web y API para emprendimiento dedicado al arte, diseño y la encuadernación artesanal.

## 🚀 Características
- **Backend Robusto:** Desarrollado con Node.js, Express y Sequelize (MySQL).
- **Consumo de API Seguro:** Autenticación basada en JSON Web Tokens (JWT) con roles diferenciados (`usuario` y `admin`).
- **Frontend Dinámico:** Renderizado del lado del servidor utilizando el motor de plantillas **Nunjucks**.
- **Diseño Premium:** Interfaz de usuario con estética *Glassmorphism*, moderna y responsive.
- **Dashboard Administrativo:** Panel de control integral para la gestión de Productos, Modelos, Tipos, Eventos, Posteos y Usuarios (CRUD completo).
- **Inicio de Sesión con Google:** Integración con Google OAuth 2.0 mediante Passport.js.
- **Gestión de Stock Masiva:** Funcionalidad para exportar el inventario a Excel (.xlsx), modificar cantidades y precios en lote, y volver a importar el archivo para una actualización rápida.
- **Borrado Lógico (Soft Deletes):** Implementación de borrado seguro (`paranoid` models) para evitar la pérdida permanente de datos en todas las entidades clave.
- **Gestión de Usuarios:** Posibilidad de suspender/activar usuarios, asignar roles de administrador y restricción de login para cuentas suspendidas.
- **Gestión de Contenidos:**
  - **Catálogo:** Visualización jerárquica de productos agrupados por categorías y modelos.
  - **Eventos:** Gestión y visualización de ferias y talleres (con integración a Google Maps).
  - **Blog/Posteos:** Sistema de publicaciones del administrador con capacidad de comentarios. Los usuarios pueden **editar y borrar** sus propios comentarios.
  - **Muro de Mensajes:** Página de contacto con muro público donde cualquier usuario (invitado o registrado) puede participar.

  - **Imágenes:** Carga y gestión de archivos multimedia mediante Multer.

## 🛠️ Tecnologías
- **Core:** Node.js, Express
- **Base de Datos:** MySQL via Sequelize ORM
- **Vistas:** Nunjucks (con filtros personalizados como `dayjs` para fechas)
- **Seguridad:** Bcryptjs (hashing de contraseñas), JWT (sesiones)
- **Autenticación Social:** Passport.js (Google Strategy)
- **Estilo:** CSS Vanilla (Custom Properties, Glassmorphism, Micro-animaciones)

## 📁 Estructura de Carpetas
- `models/` — Definición de entidades (Usuario, Producto, Posteo, Evento, etc.)
- `controllers/` — Lógica de negocio (auth, productos, posteos, eventos)
- `routes/` — Rutas para la API (`/api/*`) y para las vistas del Frontend (`/`)
- `views/` — Plantillas Nunjucks (`.njk`) y Layout principal
- `public/` — Archivos estáticos: CSS, JS cliente (auth logic) e Imágenes del front
- `uploads/` — Almacenamiento de imágenes subidas por Multer
- `db/` — Configuración de conexión Sequelize
- `config/` — Configuración de estrategias de autenticación (Passport.js).

## ⚙️ Instalación y Configuración
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env`:
   ```env
   # Base de Datos
   DB_NAME=proyecto_filomena
   DB_USER=usuario
   DB_PASS=contraseña
   DB_HOST=localhost
   DB_DIALECT=mysql

   # Seguridad
   JWT_SECRET=tu_clave_secreta

   # Google OAuth (Opcional para desarrollo local)
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret

   # Datos de Contacto (Para que no queden hardcodeados en el repo)
   CONTACT_WHATSAPP=tu_numero_de_whatsapp
   CONTACT_INSTAGRAM=tu_usuario_de_instagram
   ```

4. Sincroniza la estructura de la base de datos:
   ```bash
   node sync.js
   ```
5. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🔐 Guía de Configuración: Google OAuth
Para habilitar el inicio de sesión con Google, sigue estos pasos:

1. Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (ej: "Filomena-Web").
3. Ve a **API y Servicios > Pantalla de consentimiento de OAuth**, configúrala como "Externa" y completa los datos mínimos.
4. En **API y Servicios > Credenciales**, haz clic en **Crear credenciales > ID de cliente de OAuth**.
5. Selecciona **Aplicación web**.
6. En **Orígenes de JavaScript autorizados**, añade: `http://localhost:3000`.
7. En **URI de redireccionamiento autorizados**, añade: `http://localhost:3000/api/auth/google/callback`.
8. Copia el **Client ID** y el **Client Secret** y pégalos en tu archivo `.env`.

## 🔐 API & Seguridad
- **JWT Fix:** Se corrigió un bug crítico donde el token no incluía el rol del usuario, impidiendo la validación de administradores. Ahora el payload contiene `{ id, nombreUsuario, rol }`.
- **Endpoints Protegidos:** Solo los usuarios con rol `admin` pueden crear eventos, productos o eliminar comentarios.
- **Rutas Principales:**
  - `POST /api/login`: Genera el token de acceso.
  - `GET /catalogo`: Vista pública de productos.
  - `GET /eventos`: Vista pública de próximos eventos.
  - `POST /api/posteos/:id/comentarios`: Permite a cualquier usuario registrado comentar.

## 🛡️ Panel de Administración
Acceso mediante `/admin`. El panel permite:
- Gestionar stock de productos, modelos y tipos de producto.
- Programar y describir eventos.
- Moderar cualquier comentario en el blog.
- Administrar estados de cuenta de usuarios (activar/suspender/promocionar).
- Carga de imágenes con previsualización para productos y posteos.


---
*Filomena Arte y Diseño - Pasión por la encuadernación artesanal.*
