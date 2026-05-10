import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Productos from "../views/Productos.vue";
import Selector from "../views/Selector.vue";
import Registro from "../views/Registro.vue";
import Movimientos from "../views/Movimientos.vue";
import Reportes from "../views/Reportes.vue";
import Configuracion from "../views/Configuracion.vue";
import RegistrarProducto from "../views/RegistrarProducto.vue";
import RecuperarContraseña from "../views/RecuperarContraseña.vue";

const routes = [
  { path: "/", component: Selector },
  { path: "/login", component: Login },
  { path: "/recuperar-contrasena", component: RecuperarContraseña },
  { path: "/registro", component: Registro },
  { path: "/registrar-producto", component: RegistrarProducto },
  { path: "/dashboard", component: Dashboard },
  { path: "/productos", component: Productos },
  { path: "/movimientos", component: Movimientos },
  { path: "/reportes", component: Reportes },
  { path: "/configuracion", component: Configuracion }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;