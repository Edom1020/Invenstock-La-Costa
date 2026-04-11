import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Productos from "../views/Productos.vue";
import Selector from "../views/Selector.vue";
import Registro from "../views/Registro.vue";
import Movimientos from "../views/Movimientos.vue";
import Reportes from "../views/Reportes.vue";

const routes = [
  { path: "/", component: Selector },
  { path: "/login", component: Login },
  { path: "/registro", component: Registro },
  { path: "/dashboard", component: Dashboard },
  { path: "/productos", component: Productos },
  { path: "/movimientos", component: Movimientos },
  { path: "/reportes", component: Reportes }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;