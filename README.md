
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
- **Sincronización con Google Sheets (Catálogo de Meta):** Exportación automática de productos visibles con formato compatible para el Catálogo de Facebook/Meta Business Manager, eliminando etiquetas HTML y formateando imágenes/precios.
- **Exportación de Catálogo:** Descarga completa del catálogo de productos publicados en formato ZIP comprimido, incluye archivo JSON con metadatos y todas las imágenes de los productos (perfecto para backup, portales o migración).
- **Borrado Lógico (Soft Deletes):** Implementación de borrado seguro (`paranoid` models) para evitar la pérdida permanente de datos en todas las entidades clave.
- **Gestión de Usuarios:** Posibilidad de suspender/activar usuarios, asignar roles de administrador y restricción de login para cuentas suspendidas.
- **Carrito de Compras:** 
  - Sistema de persistencia local (`localStorage`) para que los productos no se pierdan al navegar.
  - Validación de stock en tiempo real (impede sumar más productos de los disponibles).
  - Interfaz dinámica con contador en la barra de navegación y gestión de cantidades desde la vista de carrito.
- **Pedidos vía WhatsApp:** Integración directa que genera un mensaje detallado con el pedido (productos, cantidades y totales) y redirige al WhatsApp oficial para concretar la venta.
- **Gestión de Contenidos:**
  - **Catálogo:** Visualización jerárquica de productos agrupados por categorías y modelos.
  - **Eventos:** Gestión y visualización de ferias y talleres (con integración a Google Maps).
  - **Blog/Posteos:** Sistema de publicaciones del administrador con capacidad de comentarios. Los usuarios pueden **editar y borrar** sus propios comentarios. Cada posteo admite **hasta 3 imágenes en carrusel** y **videos de YouTube embebidos**.
  - **Muro de Mensajes:** Página de contacto con muro público donde cualquier usuario (invitado o registrado) puede participar.

  - **Imágenes:** Carga y gestión de archivos multimedia mediante Multer, incluyendo galería de posteos y contenido embebido.

## 🌐 Páginas y Funcionalidades del Sitio Web
El sitio web ofrece una experiencia completa para usuarios y administradores. A continuación, se detallan las páginas principales y sus funcionalidades:

- **Inicio:** Página principal con mensaje de bienvenida, enlaces directos al catálogo y eventos, y un footer con el logo de la marca y un arte ASCII animado.
- **Catálogo:** Exploración de productos artesanales organizados por categorías (tipos) y modelos, con detalles individuales de cada producto.
- **Eventos:** Visualización de talleres y ferias programadas, incluyendo descripciones, fechas y ubicación con integración a Google Maps.
- **Blog:** Publicaciones del administrador con sistema de comentarios donde los usuarios pueden interactuar (editar y eliminar sus propios comentarios).
- **Contacto:** Formulario de contacto y muro público de mensajes para participación abierta.
- **Carrito de Compras:** Sistema de carrito persistente con validación de stock, gestión de cantidades y opción de pedido vía WhatsApp.
- **Perfil:** Área personal para usuarios registrados, donde pueden gestionar su información.
- **Admin:** Panel exclusivo para administradores con herramientas CRUD para productos, usuarios, eventos, posteos y moderación de comentarios.
- **Login/Registro:** Autenticación de usuarios con opción de inicio de sesión mediante Google OAuth 2.0.

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

   # Datos de Contacto (Para que no queden hardcodeados en el repo - Fallbacks opcionales)
   CONTACT_WHATSAPP=tu_numero_de_whatsapp
   CONTACT_INSTAGRAM=tu_usuario_de_instagram
   CONTACT_TELEGRAM=tu_usuario_de_telegram
   CONTACT_TIKTOK=tu_usuario_de_tiktok
   CONTACT_FACEBOOK=tu_usuario_de_facebook
   CONTACT_REDDIT=tu_usuario_de_reddit

   # Sincronización con Google Sheets (Catálogo de Meta)
   DOMAIN=http://localhost:3000
   GOOGLE_SHEET_ID=id_de_tu_hoja_de_calculo
   GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-cuenta-de-servicio@nombre-de-proyecto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### 📱 Configuración de Redes Sociales (Contacto)
Los canales oficiales de contacto de la tienda se pueden configurar de dos formas:

1. **Panel de Administración (Recomendado):**
   Accede a `/admin` y dirígete a la pestaña **Config. Site**. Desde allí podrás editar y guardar dinámicamente los usuarios, números y la visibilidad de cada red social. Esto persiste directamente en la base de datos e impacta en tiempo real tanto en la página de **Contacto** como en el envío del pedido vía **WhatsApp** del carrito de compras.

2. **Variables de Entorno (Fallback):**
   Si la base de datos no contiene registros para una red social, el servidor buscará las variables configuradas en el archivo `.env`:
   * **WhatsApp:** Solo números con código de país (ej. `5491176XXXXXX`).
   * **Instagram:** Nombre de usuario (ej. `filomena.arteydiseno`).
   * **Telegram:** Nombre de usuario (ej. `tu_usuario`).
   * **TikTok:** Nombre de usuario (ej. `tu_usuario`).
   * **Facebook:** Nombre de usuario o página (ej. `tu_usuario_o_pagina`).
   * **Reddit:** Nombre de usuario (ej. `tu_usuario`).

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

## 📊 Sincronización con Google Sheets (Catálogo de Meta)
El sistema permite exportar de manera automática o programada los productos visibles al formato requerido por **Meta Business Manager (Facebook Catalog)**.

### Configuración de Google Sheets:
1. Crea una hoja de cálculo en Google Sheets y copia su ID desde la URL (`https://docs.google.com/spreadsheets/d/ID_AQUI/edit`). Pégala en `GOOGLE_SHEET_ID`.
2. Crea una cuenta de servicio en **Google Cloud Console**, habilita la **Google Sheets API** para tu proyecto, y genera una clave privada en formato JSON.
3. Copia el correo electrónico de la cuenta de servicio y pégalo en `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
4. Comparte tu hoja de cálculo con ese correo otorgándole permisos de **Editor**.
5. Copia la clave privada de tu archivo JSON (incluyendo las líneas de inicio y fin) y pégala en `GOOGLE_PRIVATE_KEY` en tu archivo `.env` (asegurándote de mantener los saltos de línea codificados como `\n` o encerrando el valor entre comillas).
6. Configura `DOMAIN` en el `.env` con la URL base de tu servidor (ej: `http://localhost:3000` en desarrollo) para que las imágenes y los enlaces a los productos generen URLs absolutas válidas para Meta.

### Métodos de Sincronización:
- **Vía API:** Realiza una petición `GET` a `/api/admin/productos/exportar-sheets`. Esta ruta requiere autenticación de administrador.
- **Vía Script (CLI):** Ejecuta en la terminal el siguiente comando (útil para automatizar mediante tareas programadas/cron):
  ```bash
  node scripts/sync-google-sheets.js
  ```

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
- Carga de imágenes con previsualización para productos y posteos, incluyendo **galerías múltiples y videos de YouTube** en posteos.
- **Exportar catálogo completo:** Descargar todos los productos publicados en un archivo ZIP con metadatos en JSON e imágenes incluidas (ideal para backups, portales externos o migraciones de datos).

## 📝 Historial de Funciones y Correcciones
- **Exportación de catálogo en ZIP:** Nueva funcionalidad que permite descargar todos los productos publicados con sus imágenes en un archivo ZIP comprimido, incluye archivo JSON con metadatos del catálogo.
- **Mejoras en lo responsive de las vistas:** Optimización de la interfaz para dispositivos móviles y tablets.
- **Agregado de orden de tipo y modelo:** Implementación de ordenamiento jerárquico en el catálogo.
- **Agregado de carrito de compras:** Sistema completo con persistencia y validación de stock.
- **Mejoras en producto detalle y layout:** Mejor presentación de productos individuales.
- **Mejora en exportación de productos a Excel:** Optimización del proceso de exportación e importación de inventario.
- **Mejoras en las mensajerías:** Actualizaciones en sistemas de notificaciones y comunicación.
- **Más mejoras en el login:** Correcciones y mejoras en la autenticación de usuarios.
- **Mejoras en el login:** Refinamientos en el proceso de inicio de sesión.
- **Mejoras en producto:** Actualizaciones en la gestión de productos.
- **Agregado de logo en página principal:** Incorporación del branding oficial.
- **Mejoras en eventos productos y posteos:** Refinamientos en eventos, productos y blog.
- **Corrección y mejoras:** Correcciones generales y optimizaciones.
- **Agregado de /admin:** Desarrollo del panel administrativo.
- **Agregado de eventos:** Implementación de gestión de eventos.
- **Agregado de vistas en HTML:** Creación de vistas frontend.
- **Nuevos modelos y APIs: Evento, Posteo y Comentario:** Adición de nuevas entidades y endpoints.

---
*Filomena Arte y Diseño -*
