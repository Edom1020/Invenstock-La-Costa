<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <Sidebar :tema="temaStore.temaActual" />

  
    <!-- MAIN -->
    <div class="main">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
          <input type="text" placeholder="Buscar productos..." />
        </div>
        <div class="topbar-right">
          <button class="notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
            <span class="notif-dot"></span>
          </button>
          <div class="avatar-btn" @click="triggerFileInput" title="Cambiar foto de perfil">
            <img v-if="profilePhoto" :src="profilePhoto" class="avatar-img" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display:none"
            @change="handlePhotoChange"
          />
        </div>
      </header>

      <!-- CONTENT -->
      <div class="content">
        <h1 class="page-title">Dashboard</h1>

        <!-- KPI CARDS -->
        <div class="kpi-grid">

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">TOTAL PRODUCTOS</div>
              <div class="kpi-value">120</div>
            </div>
            <div class="kpi-icon-wrap blue">
              <img src="/images/images-dashboard/cajadecuadrotproductos.png" class="kpi-img" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">BAJO STOCK</div>
              <div class="kpi-value danger">5</div>
              <div class="kpi-alert">Acción inmediata</div>
            </div>
            <div class="kpi-icon-wrap red">
              <img src="/images/images-dashboard/warningtriangular.png" class="kpi-img" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">MOVIMIENTOS HOY</div>
              <div class="kpi-value">24</div>
              <div class="kpi-sub">
                🕐 12 entraron / 12 salieron
              </div>
            </div>
            <div class="kpi-icon-wrap teal">
              <img src="/images/images-dashboard/movimientosicon.png" class="kpi-img" />
            </div>
          </div>

        </div>

        <!-- TABLA MOVIMIENTOS -->
        <div class="table-card">
          <div class="table-header">
            <h2>Últimos Movimientos</h2>
            <button class="filter-btn">Filtrar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>FECHA</th>
                <th>PRODUCTO</th>
                <th>TIPO</th>
                <th>CANTIDAD</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mov in movimientos" :key="mov.id">
                <td class="fecha-cell">{{ mov.fecha }}</td>
                <td>
                  <div class="prod-cell">
                    <div :class="['cat-icon', mov.categoria]">
                      <img :src="getCatIcon(mov.categoria)" class="cat-img" />
                    </div>
                    <span class="prod-name">{{ mov.producto }}</span>
                  </div>
                </td>
                <td>
                  <span :class="['badge', mov.tipo.toLowerCase()]">
                    {{ mov.tipo }}
                  </span>
                </td>
                <td class="qty">{{ mov.cantidad }}</td>
              </tr>
            </tbody>
          </table>

          <div class="see-all">
            <span>Ver todos los movimientos</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>

import Sidebar from "../components/Sidebar.vue";
import { ref } from 'vue'

import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const profilePhoto = ref(null)
const fileInput = ref(null)
const userInitials = 'JD'

const triggerFileInput = () => {
  fileInput.value.click()
}

const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    profilePhoto.value = URL.createObjectURL(file)
  }
}

const getCatIcon = (categoria) => {
  const icons = {
    electronica: '/images/images-dashboard/macbookicon.png',
    hogar: '/images/images-dashboard/sofagrande.png',
    comida: '/images/images-dashboard/manzanaicon.png',
  }
  return icons[categoria] || '/images/images-dashboard/laptopicon.png'
}

const movimientos = ref([
  { id: 1, fecha: 'Ene 26, 14:30', producto: 'MacBook Pro M2',           categoria: 'electronica', tipo: 'Entrada', cantidad: 12 },
  { id: 2, fecha: 'Feb 26, 15:00', producto: 'Sofá grande',               categoria: 'hogar',       tipo: 'Salida',  cantidad: 4  },
  { id: 3, fecha: 'Mar 26, 12:15', producto: 'Airpods 4',                 categoria: 'electronica', tipo: 'Entrada', cantidad: 30 },
  { id: 4, fecha: 'Abr 26, 10:00', producto: 'Caja de manzanas grande x40', categoria: 'comida',   tipo: 'Salida',  cantidad: 20 },
])
</script>

<style scoped>
/* ── VARIABLES TEMA CLARO ── */
.layout {
  --bg-pag:      #f0f2f5;
  --bg-card:     #ffffff;
  --bg-input:    #f1f5f9;
  --borde:       #e5e7eb;
  --txt-titulo:  #0f172a;
  --txt-normal:  #334155;
  --txt-suave:   #64748b;
  --txt-muted:   #94a3b8;
  --txt-danger:  #ef4444;
  --azul:        #38BDF8;
  --cat-elec:    #e0f2fe;
  --cat-hogar:   #fef3c7;
  --cat-comida:  #dcfce7;
  --entrada-bg:  #dcfce7;
  --entrada-txt: #15803d;
  --salida-bg:   #fee2e2;
  --salida-txt:  #dc2626;
  --prod-name:    #0f172a;
}

/* ── VARIABLES TEMA OSCURO ── */
.layout.dark-mode {
  --bg-pag:      #0f172a;
  --bg-card:     #1e293b;
  --bg-input:    #334155;
  --borde:       #475569;
  --txt-titulo:  #f1f5f9;
  --txt-normal:  #cbd5e1;
  --txt-suave:   #94a3b8;
  --txt-muted:   #64748b;
  --txt-danger:  #f87171;
  --azul:        #38BDF8;
  --cat-elec:    #1e3a5f;
  --cat-hogar:   #3d2e0a;
  --cat-comida:  #0f2e1a;
  --entrada-bg:  #14532d;
  --entrada-txt: #86efac;
  --salida-bg:   #450a0a;
  --salida-txt:  #fca5a5;
  --prod-name:    #ffffff;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.layout {
  display: flex;
  height: 100vh;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── TOPBAR ── */
.topbar {
  background: var(--bg-card);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border-radius: 8px;
  padding: 7px 14px;
  width: 260px;
  transition: background 0.3s;
}

.search-icon { width: 15px; height: 15px; object-fit: contain; }

.search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--txt-normal);
  width: 100%;
}

.search-wrap input::placeholder { color: var(--txt-muted); }

.topbar-right { display: flex; align-items: center; gap: 14px; }

.notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-input);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative; font-size: 16px;
  transition: background 0.3s;
}

.notif-dot {
  width: 8px; height: 8px;
  background: #ef4444;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid var(--bg-card);
}

.avatar-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #0ea5e9;
  border: 2px solid #38BDF8;
  cursor: pointer; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff; font-weight: 600; font-size: 14px;
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* ── CONTENT ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--txt-titulo);
  margin-bottom: 22px;
  transition: color 0.3s;
}

/* ── KPI CARDS ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.kpi-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--txt-suave);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.kpi-value {
  font-size: 38px;
  font-weight: 700;
  color: var(--txt-titulo);
  line-height: 1;
  margin-bottom: 6px;
  transition: color 0.3s;
}

.kpi-value.danger { color: var(--txt-danger); }

.kpi-sub {
  font-size: 12px;
  color: var(--txt-muted);
  transition: color 0.3s;
}

.kpi-alert {
  font-size: 12px;
  color: var(--txt-danger);
  font-weight: 600;
}

.kpi-icon-wrap {
  width: 64px; height: 64px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s;
}

.kpi-icon-wrap.blue  { background: #e0f2fe; }
.kpi-icon-wrap.red   { background: #fee2e2; }
.kpi-icon-wrap.teal  { background: #ccfbf1; }

.kpi-img { width: 36px; height: 36px; object-fit: contain; }

/* ── TABLE CARD ── */
.table-card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 24px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: var(--bg-card); 
}


.table-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--txt-titulo);
  transition: color 0.3s;
}


.filter-btn {
  font-size: 13px;
  color: var(--azul);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

table { width: 100%; border-collapse: collapse; }

thead tr th {
  font-size: 11px; font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px;
  padding: 0 0 12px 0;
  text-align: left;
  border-bottom: 1px solid var(--borde);
  transition: color 0.3s, border-color 0.3s;
}

tbody tr { border-bottom: 1px solid var(--borde); }
tbody tr:last-child { border-bottom: none; }
tbody tr td {
  padding: 14px 0;
  font-size: 13.5px;
  color: var(--txt-normal);
  vertical-align: middle;
  transition: color 0.3s;
}

.fecha-cell {
  color: var(--txt-muted);
  font-size: 13px;
}

.prod-cell { display: flex; align-items: center; gap: 10px; }

.cat-icon {
  width: 28px; height: 28px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s;
}

.cat-icon.electronica { background: var(--cat-elec); }
.cat-icon.hogar       { background: var(--cat-hogar); }
.cat-icon.comida      { background: var(--cat-comida); }

.cat-img { width: 16px; height: 16px; object-fit: contain; }

.prod-name {
  color: var(--prod-name-color);
  font-weight: 500;
}

.badge {
  font-size: 12px; font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  transition: background 0.3s, color 0.3s;
}

.badge.entrada { background: var(--entrada-bg); color: var(--entrada-txt); }
.badge.salida  { background: var(--salida-bg);  color: var(--salida-txt);  }

.qty {
  font-weight: 600;
  color: #ffffff;
}

.see-all {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--borde);
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-titulo);
  cursor: pointer;
  transition: color 0.3s;
}

.see-all:hover { color: var(--azul); }

/* 2. Corregir el color de los textos que se quedan en negro */
.layout.dark-mode .page-title,
.layout.dark-mode .table-header h2,
.layout.dark-mode .kpi-value:not(.danger),
.layout.dark-mode tbody tr td {
  color: var(--txt-titulo);
}

.dark-mode tbody tr:hover {
  background-color: var(--bg-hover) 
}
</style>