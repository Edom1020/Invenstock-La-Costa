<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <Sidebar :tema="temaStore.temaActual" />

  
    <!-- MAIN -->
    <div class="main">

      <!-- TOPBAR -->
      <Topbar @buscar="busqueda = $event" />

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
             <button class="filter-btn" @click="mostrarFiltros = !mostrarFiltros">Filtrar</button>
          </div>

            <!-- PANEL DE FILTROS (aparece al hacer clic) -->
              <div v-if="mostrarFiltros" class="filtros-panel">
                <div class="filtros-grupo">
                  <div class="filtros-titulo">Tipo</div>
                  <div class="filtros-opciones">
                    <span
                      v-for="tipo in ['Todos', 'Entrada', 'Salida']"
                      :key="tipo"
                      :class="['filtro-pill', filtroTipo === tipo ? 'active' : '']"
                      @click="filtroTipo = tipo"
                    >
                      {{ tipo }}
                    </span>
                  </div>
                </div>
                <div class="filtros-grupo">
                  <div class="filtros-titulo">Categoría</div>
                  <div class="filtros-opciones">
                    <span
                      v-for="cat in ['Todas', 'electronica', 'hogar', 'comida']"
                      :key="cat"
                      :class="['filtro-pill', filtroCategoria === cat ? 'active' : '']"
                      @click="filtroCategoria = cat"
                    >
                      {{ cat === 'electronica' ? 'Electrónica' : cat === 'hogar' ? 'Hogar' : cat === 'comida' ? 'Comida' : cat }}
                    </span>
                  </div>
                </div>
                <button class="filtros-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
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
              <tr v-for="mov in movimientosFiltrados" :key="mov.id">
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

          <div class="see-all" @click="$router.push('/movimientos')">
              <span>Ver todos los movimientos</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";
import { ref, computed, inject } from 'vue'


import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

// Para el buscador de productos en el topbar //
const busqueda = ref('')

// Para filtrar los movimientos según el término de búsqueda ingresado //
const movimientosFiltrados = computed(() => {
  return movimientos.value.filter(m => {
    const porTipo = filtroTipo.value === 'Todos' || m.tipo === filtroTipo.value
    const porCategoria = filtroCategoria.value === 'Todas' || m.categoria === filtroCategoria.value
    const porBusqueda = m.producto.toLowerCase().includes(busqueda.value.toLowerCase())
    return porTipo && porCategoria && porBusqueda
  })
})



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

const mostrarFiltros = ref(false)
const filtroTipo = ref('Todos')
const filtroCategoria = ref('Todas')

const limpiarFiltros = () => {
  filtroTipo.value = 'Todos'
  filtroCategoria.value = 'Todas'
}

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

/* ── CONTENT ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

.page-title {
  font-size: 24px;
  font-weight: 700px;
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

.kpi-icon-wrap.blue  { background: #1b308f; }
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


/* -- Estilos para el panel de filtros desplegable -- */

.filtros-panel {
  background: var(--bg-card);
  border: 1px solid var(--borde);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: background 0.3s, border-color 0.3s;
}

.filtros-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtros-titulo {
  font-size: 11px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.filtros-opciones {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filtro-pill {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid var(--borde);
  background: var(--bg-input);
  color: var(--txt-normal);
  transition: all 0.15s;
}

.filtro-pill:hover { border-color: #38BDF8; color: #0369a1; }
.filtro-pill.active { border-color: #38BDF8; background: #e0f2fe; color: #0369a1; font-weight: 600; }

.filtros-limpiar {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--txt-muted);
  cursor: pointer;
  text-align: left;
  font-weight: 600;
  width: fit-content;
}

.filtros-limpiar:hover { color: #ef4444; }

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

/* Corregir el color de los textos que se quedan en negro */
.layout.dark-mode .page-title,
.layout.dark-mode .table-header h2,
.layout.dark-mode .kpi-value:not(.danger),
.layout.dark-mode tbody tr td {
  color: var(--txt-titulo);
}

.dark-mode tbody tr:hover {
  background-color: var(--bg-hover) 
}


.topbar {
  background: var(--bg-card);
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid var(--borde);
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .content { padding: 16px; }
  .dashboard-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
  .kpi-card { padding: 16px; }
  .kpi-label { font-size: 11px; }
  .kpi-value { font-size: 24px; }
  .table-header { margin-top: 20px; }
  tbody td { font-size: 12px; padding: 12px 8px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .layout {
    flex-direction: column;
  }

  .main {
    width: 100%;
  }

  .content { padding: 12px; }
  .page-title { font-size: 18px; }
  .dashboard-grid { grid-template-columns: 1fr; gap: 12px; }
  .kpi-card { padding: 12px; }
  .kpi-label { font-size: 10px; }
  .kpi-value { font-size: 20px; }
  .table-header h2 { font-size: 14px; }
  thead th { font-size: 10px; }
  tbody td { font-size: 11px; padding: 10px 6px; }
  .badge { font-size: 11px; padding: 2px 8px; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  .kpi-value { font-size: 18px; }
  thead th { font-size: 9px; }
  tbody td { font-size: 10px; padding: 8px 4px; }
}
</style>