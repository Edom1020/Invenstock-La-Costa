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
import RecuperarContrasena from "../views/RecuperarContrasena.vue/index.js";


const routes = [
  { path: "/", component: Selector, meta: { requiresAuth: false } },
  { path: "/login", component: Login, meta: { requiresAuth: false } },
  { path: "/recuperar-contrasena", component: RecuperarContrasena, meta: { requiresAuth: false } },
  { path: "/registro", component: Registro, meta: { requiresAuth: false } },
  { path: "/registrar-producto", component: RegistrarProducto, meta: { requiresAuth: false } },
  { path: "/dashboard",     component: Dashboard,     meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
  { path: "/productos",     component: Productos,     meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
  { path: "/lotes",         component: Lotes,         meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
  { path: "/movimientos",   component: Movimientos,   meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
  { path: "/reportes",      component: Reportes,      meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
  { path: "/configuracion", component: Configuracion, meta: { requiresAuth: true, roles: ['administrador', 'admin', 'usuario'] } },
     
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Ruta global para verificar autenticación y roles antes de cada navegación
router.beforeEach((to, from) => {
  const usuarioStore = useUsuarioStore()
  const requiresAuth = to.meta.requiresAuth
  const userRole = usuarioStore.rol
  const isAuthenticated = usuarioStore.estaAutenticado

  // DEBUG TEMPORAL
  console.log('🔒 Navegando a:', to.path, '| rol:', userRole, '| autenticado:', isAuthenticated)

  if (requiresAuth && !isAuthenticated) {
    return { path: '/login' }
  }

  if (requiresAuth && isAuthenticated) {
    const allowedRoles = to.meta.roles || []
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return { path: '/' }
    }
  }
})
export default router;