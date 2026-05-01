<template>
  <!--
    ============================================================
    Sidebar.vue
    Barra lateral de navegación.
    Acepta un prop "tema" para cambiar el logo entre
    modo claro (logoclaro.png) y modo oscuro (logooscuro.png).
    ============================================================
  -->
  <aside class="sidebar">

    <!-- Logo: cambia según el tema -->
    <div class="logo-area">
      <img
        :src="tema === 'oscuro' ? '/images/logooscuro.png' : '/images/logoclaro.png'"
        class="logo-img"
        alt="Logo INVENSTOCK La Costa"
      />
    </div>

    <!-- Menú de navegación -->
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

      <!-- Enlace a la página de Configuración -->
      <router-link to="/configuracion" class="nav-item" active-class="active">
        <img src="/images/images-dashboard/ajustesicon.png" class="nav-icon" />
        Configuración
      </router-link>

    </nav>

    <!-- Botón de cerrar sesión -->
    <div class="logout" @click="cerrarSesion">
      <img src="/images/images-dashboard/logouticon.png" class="nav-icon" />
      Cerrar sesión
    </div>

  </aside>
</template>


<script setup>
import { useRouter } from 'vue-router'

// ── Props: recibimos el tema desde la vista padre ──
// Si no se pasa ningún valor, el tema por defecto es 'claro'
const props = defineProps({
  tema: {
    type: String,
    default: 'claro'
  }
})

const router = useRouter()

// Redirige al usuario a la pantalla de login al cerrar sesión
const cerrarSesion = () => {
  router.push('/')
}
</script>


<style>
/* ── SIDEBAR ── */

/* Sidebar oscuro */
.dark-mode .sidebar         { background: var(--bg-sidebar); border-right-color: var(--borde); }
.dark-mode .nav-item        { color: var(--txt-suave); }
.dark-mode .nav-item:hover  { background: #334155; }
.dark-mode .nav-item.active { background: #1e3a5f; color: var(--azul); }
.dark-mode .logout          { color: var(--txt-suave); }
.dark-mode .topbar       { background: var(--bg-topbar); border-bottom-color: var(--borde); }
.dark-mode .search-wrap  { background: var(--bg-input); }
.dark-mode .search-wrap input { color: var(--txt-normal); }
.dark-mode .notif-btn    { background: var(--bg-input); }

.sidebar {
  width: 210px;
  min-width: 210px;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-right: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.dark-mode .sidebar {
  background: var(--bg-card);
}

.dark-mode .nav-item {
  color: var(--txt-suave);
}

.dark-mode .nav-item:hover {
  background: var(--bg-input);
}

.dark-mode .nav-item.active {
  background: #1e3a5f; /* Color azul oscuro de selección */
  color: var(--azul);
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

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
}

/* Estilos base (Modo Claro) */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13.5px;
  color: var(--txt-normal); /* Usar variable */
  text-decoration: none;
  transition: all 0.2s;
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
  color: var(--txt-suave);
  cursor: pointer;
  transition: color 0.2s;
}

.dark-mode .logout:hover { color: var(--txt-danger); }
</style>