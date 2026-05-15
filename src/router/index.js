import { createRouter, createWebHistory } from "vue-router";
import { useUsuarioStore } from '../stores/usuario';
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Productos from "../views/Productos.vue";
import Lotes from "../views/Lotes.vue";
import Selector from "../views/Selector.vue";
import Registro from "../views/Registro.vue";
import Movimientos from "../views/Movimientos.vue";
import Reportes from "../views/Reportes.vue";
import Configuracion from "../views/Configuracion.vue";
import RegistrarProducto from "../views/RegistrarProducto.vue";
import RecuperarContraseña from "../views/RecuperarContraseña.vue";


const routes = [
  { path: "/", component: Selector, meta: { requiresAuth: false } },
  { path: "/login", component: Login, meta: { requiresAuth: false } },
  { path: "/recuperar-contrasena", component: RecuperarContraseña, meta: { requiresAuth: false } },
  { path: "/registro", component: Registro, meta: { requiresAuth: false } },
  { path: "/registrar-producto", component: RegistrarProducto, meta: { requiresAuth: false } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } },
  { path: "/productos", component: Productos, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } },
  { path: "/lotes", component: Lotes, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } },
  { path: "/movimientos", component: Movimientos, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } },
  { path: "/reportes", component: Reportes, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } },
  { path: "/configuracion", component: Configuracion, meta: { requiresAuth: true, roles: ['administrador', 'usuario'] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to protect routes based on authentication and role
router.beforeEach((to, from, next) => {
  const usuarioStore = useUsuarioStore();
  const requiresAuth = to.meta.requiresAuth;
  const userRole = usuarioStore.rol;
  const isAuthenticated = usuarioStore.estaAutenticado;

  // If route requires authentication and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page
    next({ path: '/login' });
  } else if (requiresAuth && isAuthenticated) {
    // Check if user has the required role for this route
    const allowedRoles = to.meta.roles || [];
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // User doesn't have permission, redirect to home or show unauthorized
      next({ path: '/' });
    } else {
      // User is authenticated and has proper role
      next();
    }
  } else {
    // Route doesn't require authentication or user is not trying to access protected route
    next();
  }
});

export default router;