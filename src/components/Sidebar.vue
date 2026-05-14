<template>
  <!--
    ============================================================
    Sidebar.vue
    Barra lateral de navegación.
    Acepta un prop "tema" para cambiar el logo entre
    modo claro (logoclaro.png) y modo oscuro (logooscuro.png).
    ============================================================
  -->

  <!-- Botón Hamburguesa (solo en móvil) -->
  <button class="hamburger-btn" @click="toggleSidebar">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>

  <!-- Overlay (se cierra al clickear fuera) -->
  <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

  <!-- Sidebar -->
  <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">

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

      <router-link to="/dashboard" class="nav-item" active-class="active" @click="sidebarOpen = false">
        <img src="/images/images-dashboard/dashboardicon.png" class="nav-icon" />
        Dashboard
      </router-link>

      <router-link to="/productos" class="nav-item" active-class="active" @click="sidebarOpen = false">
        <img src="/images/images-dashboard/inventarioicon.png" class="nav-icon" />
        Inventario
      </router-link>

      <router-link to="/movimientos" class="nav-item" active-class="active" @click="sidebarOpen = false">
        <img src="/images/images-dashboard/movimientosicon.png" class="nav-icon" />
        Movimientos
      </router-link>

      <router-link to="/lotes" class="nav-item" active-class="active" @click="sidebarOpen = false">
        <img src="/images/images-lotes/lotes.png" class="nav-icon" />
       Lotes
      </router-link>

      <router-link to="/reportes" class="nav-item" active-class="active" @click="sidebarOpen = false">
        <img src="/images/images-dashboard/reportesicon.png" class="nav-icon" />
        Reportes
      </router-link>

      <!-- Enlace a la página de Configuración -->
      <router-link to="/configuracion" class="nav-item" active-class="active" @click="sidebarOpen = false">
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
import { ref } from 'vue'

// ── Props: recibimos el tema desde la vista padre ──
// Si no se pasa ningún valor, el tema por defecto es 'claro'
const props = defineProps({
  tema: {
    type: String,
    default: 'claro'
  }
})

const router = useRouter()
const sidebarOpen = ref(false)

// Toggle sidebar en móvil
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Redirige al usuario a la pantalla de login al cerrar sesión
const cerrarSesion = () => {
  sidebarOpen.value = false
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
  background: #1e3a5f; 
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
  color: var(--txt-normal); 
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

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* Hamburger button (solo en móvil) */
.hamburger-btn {
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  background: var(--bg-card);
  border: 1.5px solid var(--borde);
  border-radius: 8px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  z-index: 1001;
  transition: all 0.3s;
}

.hamburger-btn:hover {
  background: var(--bg-input);
}

.hamburger-line {
  width: 22px;
  height: 2.5px;
  background: var(--txt-normal);
  border-radius: 2px;
  transition: all 0.3s;
}

/* Sidebar overlay (se muestra en móvil detrás del sidebar) */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .sidebar {
    width: 180px;
    min-width: 180px;
    padding: 16px 0;
  }

  .logo-img {
    width: 160px;
    height: 80px;
  }

  .logo-area {
    padding: 0 12px 20px 12px;
  }

  .nav-item {
    padding: 8px 10px;
    font-size: 12px;
    gap: 8px;
  }

  .nav-icon {
    width: 16px;
    height: 16px;
  }

  .logout {
    padding: 12px 16px;
    font-size: 12px;
    gap: 6px;
  }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  /* Mostrar hamburger button */
  .hamburger-btn {
    display: flex;
  }

  /* Sidebar colapsible */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    min-width: 240px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 999;
    padding: 56px 0 0 0;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  /* Overlay visible cuando sidebar está abierto */
  .sidebar-overlay {
    display: block;
  }

  .logo-area {
    padding: 16px 12px 20px 12px;
  }

  .logo-img {
    width: 140px;
    height: 70px;
  }

  .nav {
    padding: 0 8px;
    gap: 2px;
  }

  .nav-item {
    padding: 10px 12px;
    font-size: 13px;
    gap: 10px;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  .logout {
    padding: 14px 16px;
    font-size: 13px;
    gap: 8px;
  }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .hamburger-btn {
    width: 36px;
    height: 36px;
    top: 10px;
    left: 10px;
    gap: 4px;
  }

  .hamburger-line {
    width: 20px;
    height: 2px;
  }

  .sidebar {
    width: 220px;
    padding-top: 50px;
  }

  .logo-img {
    width: 120px;
    height: 60px;
  }

  .logo-area {
    padding: 12px 10px 16px 10px;
  }

  .nav-item {
    padding: 8px 10px;
    font-size: 12px;
  }

  .logout {
    padding: 12px 14px;
    font-size: 12px;
  }
}

/* Dark mode para hamburger */
.dark-mode .hamburger-btn {
  background: var(--bg-card);
  border-color: var(--borde);
}

.dark-mode .hamburger-btn:hover {
  background: var(--bg-input);
}

.dark-mode .hamburger-line {
  background: var(--txt-normal);
}
</style>