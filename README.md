# INVENSTOCK — Frontend

Interfaz web del sistema de gestión de inventarios de Distribuidora La Costa S.A.S. Desarrollada con Vue 3, Vite y Pinia.

🔗 **Aplicación en producción:** https://invenstock-la-costa.vercel.app
🔗 **API backend:** https://invenstock-la-costa.onrender.com/api
🔗 **Repositorio backend:** [backend-inventario](https://github.com/TU_USUARIO/backend-inventario)

---

## Stack tecnológico

- **Vue 3** (Composition API) — framework de interfaz
- **Vite** — bundler y servidor de desarrollo
- **Pinia** — manejo de estado global
- **Vue Router** — enrutamiento del lado del cliente (SPA)
- **axios** — cliente HTTP con interceptor de token JWT
- **Socket.io-client** — notificaciones en tiempo real
- **Chart.js** — gráficas del dashboard y reportes

---

## Requisitos previos

- Node.js 18 o superior
- El backend de INVENSTOCK corriendo (local o desplegado)

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/Edom1020/INVENSTOCK-FRONTEND.git
cd INVENSTOCK-FRONTEND

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con la URL de tu backend (ver sección de Variables de Entorno).

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://invenstock-la-costa.onrender.com/api
VITE_SOCKET_URL=https://invenstock-la-costa.onrender.com
```

Para desarrollo local, apunta a tu backend local:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## Estructura del proyecto

```
INVENSTOCK-FRONTEND/
├── public/                    # Assets estáticos (íconos, imágenes, sonidos)
├── src/
│   ├── views/                 # Vistas principales (una por ruta)
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Productos.vue
│   │   ├── Movimientos.vue
│   │   ├── Lotes.vue
│   │   ├── Reportes.vue
│   │   └── Configuracion.vue
│   ├── components/            # Componentes reutilizables
│   │   ├── Sidebar.vue
│   │   ├── Topbar.vue
│   │   ├── ModalReponerStock.vue
│   │   └── ModalExportarPDF.vue
│   ├── stores/                 # Stores de Pinia
│   │   ├── productos.js
│   │   ├── usuario.js
│   │   ├── notificaciones.js
│   │   ├── configuracion.js
│   │   └── tema.js
│   ├── router/
│   │   └── index.js            # Definición de rutas y guardas de auth
│   ├── services/
│   │   └── notificaciones.service.js
│   ├── views/api.js             # Instancia de axios configurada
│   └── App.vue
├── vercel.json                 # Configuración de rewrites para SPA
└── package.json
```

---

## Características principales

- **Autenticación** con JWT, recuperación y restablecimiento de contraseña
- **Gestión de productos** con categorías, SKU único y soporte de lotes con fechas de vencimiento
- **Registro de movimientos** de entrada y salida con historial filtrable
- **Dashboard** con KPIs en tiempo real y gráfica de tendencia semanal
- **Reportes** exportables en PDF con gráficas de distribución por categoría
- **Notificaciones en tiempo real** vía WebSocket (Socket.io)
- **Modo oscuro/claro** configurable
- **Diseño responsivo** en 4 breakpoints: escritorio (>1024px), tablet (481–1024px), móvil (≤480px) y móvil reducido (≤360px)
- **Permisos granulares** por usuario, configurables desde el panel de administración

---

## Despliegue

El frontend está desplegado en **Vercel** con integración continua: cada push a la rama `frontend` redespliega automáticamente.

El archivo `vercel.json` incluye la configuración de rewrites necesaria para que las rutas de la SPA (como `/dashboard` o `/productos`) funcionen correctamente al recargar la página:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Equipo

| Integrante | Rol |
|---|---|
| Erick Marrugo | Líder de Proyecto / Scrum Master |
| Esteban Domínguez | Diseñador / Desarrollador Frontend |
| Kevin Ochoa | Desarrollador Backend |
| Sebastián Ortiz | Administrador de Base de Datos |
| Valery Espinosa | QA & Documentadora |

Proyecto desarrollado para la asignatura **Desarrollo de Software Web — IX24451**, Universidad de Cartagena, 2026.
