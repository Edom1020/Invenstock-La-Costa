<template>
  <aside class="sidebar">

    <div class="logo-area">
      <img src="/images/logoclaro.png" class="logo-img" />
    </div>

<nav class="nav">
  <router-link to="/dashboard" class="nav-item" active-class="active">
    <img src="/images/images-dashboard/dashboardicon.png" class="nav-icon" />
    Dashboard
  </router-link>

  <router-link to="/productos" class="nav-item" active-class="active">
    <img src="/images/images-dashboard/inventarioicon.png" class="nav-icon" />
    Inventario
  </router-link>

  <router-link to="/movimientos" class="nav-item" active-class="active">
    <img src="/images/images-dashboard/movimientosicon.png" class="nav-icon" />
    Movimientos
  </router-link>

  <router-link to="/reportes" class="nav-item" active-class="active">
    <img src="/images/images-dashboard/reportesicon.png" class="nav-icon" />
    Reportes
  </router-link>

  <div class="nav-item">
    <img src="/images/images-dashboard/ajustesicon.png" class="nav-icon" />
    Ajustes
  </div>
</nav>

    <div class="logout" @click="cerrarSesion">
     <img src="/images/images-dashboard/logouticon.png" class="nav-icon" />
      Cerrar sesión
    </div>

  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const cerrarSesion = () => {
  router.push("/");
};
</script>
<style>

/* ── SIDEBAR ── */
.sidebar {
  width: 210px;
  min-width: 210px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-right: 1px solid #e5e7eb;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 28px 16px;
}

.logo-img {
  width: 200px;
  height: 100px;
  border-radius: 50px;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-text .brand {
  font-weight: 700;
  font-size: 13px;
  color: #1e7fc2;
  line-height: 1.2;
}

.logo-text .sub {
  font-size: 9px;
  color: #64748b;
  line-height: 1.3;
}

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13.5px;
  color: #475569;
  transition: background 0.15s;
  text-decoration: none;
}

.nav-item:hover { background: #f1f5f9; }

.nav-item.active {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 600;
}

.nav-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
}

.logout:hover { color: #ef4444; }
</style>