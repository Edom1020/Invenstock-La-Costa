<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <Sidebar :tema="temaStore.temaActual"/>

    <div class="main">

      <!-- TOPBAR -->
       <header class="topbar">
  <div class="search-wrap">
    <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
    <input v-model="busqueda" type="text" placeholder="Buscar movimientos..." />
  </div>
  
  <div class="topbar-right">
    <div class="avatar-btn">
      <img :src="usuarioStore.fotoPerfil" class="avatar-img" />
    </div>
  </div>
</header>
    

      <!-- FILTROS -->
      <div class="filters-bar">
        <div class="filters-left">
          
          <button class="filter-pill"> 
            <img src="/images/images-reportes/calendaricon.png" style="width:10px;opacity:0.6;" />
            Últimos 30 días
          </button>
           <button class="filter-pill" @click="mostrarFiltros = !mostrarFiltros">
              <img src="/images/images-movimientos/filtrar.png" style="width:10px;opacity:0.6;" />
               Filtros Avanzados
          </button>
        </div>
        <div class="filters-right">
            <button class="export-btn" @click="mostrarModalPDF = true">
                ⬇ Exportar PDF
            </button>
        </div>
      </div>

      <!-- PANEL  -->
        <div v-if="mostrarFiltros" class="filtros-panel-rep">
        <div class="filtros-grupo">
          <div class="filtros-titulo">Categoría</div>
          <div class="filtros-opciones">
            <span
              v-for="cat in ['Todas', 'Electrónica', 'Hogar', 'Comida']"
              :key="cat"
              :class="['filtro-pill', filtroCategoria === cat ? 'active' : '']"
              @click="filtroCategoria = cat"
            >
              {{ cat }}
            </span>
          </div>
        </div>
        
        <div class="filtros-grupo">
          <div class="filtros-titulo">Estado de Stock</div>
          <div class="filtros-opciones">
            <span
              v-for="estado in ['Todos', 'Crítico', 'Bajo', 'Normal']"
              :key="estado"
              :class="['filtro-pill', filtroEstado === estado ? 'active' : '']"
              @click="filtroEstado = estado"
            >
              {{ estado }}
            </span>
          </div>
        </div>

  <button class="filtros-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
</div>

      <div class="content">

        <!-- TARJETAS RESUMEN -->
        <div class="summary-grid">
          <div class="summary-card border-green">
            <div class="summary-label">VALOR TOTAL STOCK</div>
            <div class="summary-value">$42,850 <span class="up">↑12%</span></div>
          </div>
          <div class="summary-card border-green">
            <div class="summary-label">ENTRADAS MENSUALES</div>
            <div class="summary-value">1,240 <span class="up">↑8.4%</span></div>
          </div>
          <div class="summary-card border-red">
            <div class="summary-label">SALIDAS MENSUALES</div>
            <div class="summary-value">890 <span class="down">↓2.1%</span></div>
          </div>
          <div class="summary-card border-blue">
            <div class="summary-label">ARTÍCULOS CRÍTICOS</div>
            <div class="summary-value">14 <span class="alert-badge">ALERTA</span></div>
          </div>
        </div>

        <!-- GRAFICAS -->
        <div class="charts-row">

          <!-- GRAFICA BARRAS -->
          <div class="chart-card large">
            <div class="chart-header">
              <div>
                <h2 class="chart-title">Tendencia de Movimientos</h2>
                <p class="chart-sub">Flujo de inventario diario - Noviembre 2025</p>
              </div>
              <div class="chart-legend">
                <span class="legend-dot dark-blue"></span> Entradas
                <span class="legend-dot gray"></span> Salidas
              </div>
            </div>
            <canvas id="graficaBarras"></canvas>
          </div>

          <!-- GRAFICA DONA -->
          <div class="chart-card small">
            <h2 class="chart-title">Stock por Categoría</h2>
            <p class="chart-sub">Distribución de inventario actual</p>
            <div class="donut-wrap">
              <canvas id="graficaDona"></canvas>
              <div class="donut-center">
                <span class="donut-number">2,854</span>
                <span class="donut-label">TOTAL SKU</span>
              </div>
            </div>
            <div class="category-list">
              <div class="category-row">
                <span class="legend-dot dark-blue"></span>
                <span class="category-name">Electrónica</span>
                <span class="category-pct">45%</span>
              </div>
              <div class="category-row">
                <span class="legend-dot mid-blue"></span>
                <span class="category-name">Hogar</span>
                <span class="category-pct">32%</span>
              </div>
              <div class="category-row">
                <span class="legend-dot light-blue"></span>
                <span class="category-name">Comida</span>
                <span class="category-pct">23%</span>
              </div>
            </div>
          </div>

        </div>

        <!-- TABLA ALERTAS -->
        <div class="table-card">
          <div class="table-header">
            <h2 class="section-title">Alertas de Stock Bajo</h2>
            <span class="inventory-link" @click="$router.push('/productos')">
              Ver Inventario Completo
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>EN STOCK</th>
                <th>MÍNIMO REQUERIDO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in alertasFiltradas" :key="item.id">
                <td>
                  <div class="prod-cell">
                    <div class="prod-thumb">
                      <img :src="getCatIcon(item.categoria)" style="width:16px;opacity:0.6;" />
                    </div>
                    <span class="prod-name">{{ item.nombre }}</span>
                  </div>
                </td>
                <td class="cat-cell">{{ item.categoria }}</td>
                <td class="stock-low-cell">{{ item.enStock }}</td>
                <td class="min-cell">{{ item.minimoRequerido }}</td>
                <td>
                  <button class="restock-btn" @click="abrirModalReponer(item)">
                    Reponer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
      <!-- MODAL EXPORTAR PDF -->
      <ModalExportarPDF
        v-if="mostrarModalPDF"
        @cerrar="mostrarModalPDF = false"
      />

      <!-- MODAL REPONER STOCK -->
      <ModalReponerStock
        v-if="mostrarModalReponer"
        :producto="productoSeleccionado"
        @cerrar="mostrarModalReponer = false"
        @reponedor-exitoso="onReponerExitoso"
      />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import Chart from 'chart.js/auto'
import Sidebar from "../components/Sidebar.vue";
import ModalExportarPDF from '../components/ModalExportarPDF.vue'
import ModalReponerStock from '../components/ModalReponerStock.vue'

//Modal de exportar PDF//
const mostrarModalPDF = ref(false)

//Modal de reponer stock//
const mostrarModalReponer = ref(false)
const productoSeleccionado = ref(null)

//Script para notificaciones//
const notificacionesRef = inject('notificacionesGlobal')

//DARK MODE o modo oscuro
import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

// Para mostrar la foto de perfil en el topbar y configuración, usamos el store de usuario //
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

const busqueda = ref('')

const mostrarFiltros = ref(false)
const filtroCategoria = ref('Todas')
const filtroEstado = ref('Todos')

const alertasFiltradas = computed(() => {
  return alertasStock.value.filter(a => {
    const porBusqueda = a.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                        a.categoria.toLowerCase().includes(busqueda.value.toLowerCase())

    const porCategoria = filtroCategoria.value === 'Todas' ||
                         a.categoria === filtroCategoria.value

    const porEstado = filtroEstado.value === 'Todos' ||
      (filtroEstado.value === 'Crítico' && a.enStock <= 2) ||
      (filtroEstado.value === 'Bajo'    && a.enStock > 2 && a.enStock <= 5) ||
      (filtroEstado.value === 'Normal'  && a.enStock > 5)

    return porBusqueda && porCategoria && porEstado
  })
})

const limpiarFiltros = () => {
  filtroCategoria.value = 'Todas'
  filtroEstado.value = 'Todos'
}

// ── ICONO POR CATEGORIA ──
const getCatIcon = (categoria) => {
  const iconos = {
    Electrónica: '/images/images-dashboard/macbookicon.png',
    Hogar:       '/images/images-dashboard/sofagrande.png',
    Comida:      '/images/images-dashboard/manzanaicon.png',
  }
  return iconos[categoria] || '/images/images-dashboard/macbookicon.png'
}

// ── ABRIR MODAL REPONER ──
const abrirModalReponer = (producto) => {
  productoSeleccionado.value = producto
  mostrarModalReponer.value = true
}

// ── MANEJADOR CUANDO SE REPONE EXITOSAMENTE ──
const onReponerExitoso = (data) => {
  // Actualizar el stock del producto en la tabla
  const productoEnTabla = alertasStock.value.find(p => p.id === productoSeleccionado.value.id)
  if (productoEnTabla) {
    productoEnTabla.enStock = data.nuevoStock
  }

  // Agregar notificación
  if (notificacionesRef.value) {
    notificacionesRef.value.agregarNotificacion(
      'Stock repuesto correctamente',
      `${data.producto} — ${data.cantidad} unidades agregadas. Stock actual: ${data.nuevoStock} unidades.`,
      'entrada'
    )
  }

  // Mostrar mensaje de éxito
  alert(`✅ Stock actualizado correctamente\n\n${data.producto}\nCantidad agregada: ${data.cantidad} unidades\nNuevo stock: ${data.nuevoStock} unidades`)

  // Aquí se pueden agregar más acciones como:
  // - Refrescar datos del dashboard
  // - Actualizar gráficas
  // - Modificar notificaciones en tiempo real
}

// ── DATOS TABLA ──
const alertasStock = ref([
  { id: 1, nombre: 'Tablet Pro 12.9"',     categoria: 'Electrónica', enStock: 4, minimoRequerido: 10 },
  { id: 2, nombre: 'Auriculares Studio X',  categoria: 'Electrónica', enStock: 2, minimoRequerido: 15 },
  { id: 3, nombre: 'Workstation Elite V2',  categoria: 'Electrónica', enStock: 1, minimoRequerido: 5  },
])

// ── GRAFICAS ──
onMounted(() => {

  // BARRAS
  new Chart(document.getElementById('graficaBarras'), {
    type: 'bar',
    data: {
      labels: ['LUN 01', 'MAR 02', 'MIE 03', 'JUE 04', 'VIE 05', 'SAB 06', 'DOM 07'],
      datasets: [
        {
          label: 'Entradas',
          data: [120, 200, 180, 350, 300, 420, 500],
          backgroundColor: '#1e4d7b',
          borderRadius: 6,
        },
        {
          label: 'Salidas',
          data: [80, 150, 100, 200, 180, 300, 350],
          backgroundColor: '#94a3b8',
          borderRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: '#f1f5f9' } },
        x: { grid: { display: false  } }
      }
    }
  })

  // DONA
  new Chart(document.getElementById('graficaDona'), {
    type: 'doughnut',
    data: {
      labels: ['Electrónica', 'Hogar', 'Comida'],
      datasets: [{
        data: [45, 32, 23],
        backgroundColor: ['#1e4d7b', '#378ADD', '#93c5fd'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: { legend: { display: false } }
    }
  })

})
</script>

<style>
/* ── VARIABLES TEMA CLARO ── */
.layout {
  --bg-pag:        #f0f2f5;
  --bg-card:       #ffffff;
  --bg-input:      #f1f5f9;
  --borde:         #e5e7eb;
  --borde-suave:   #f8fafc;
  --txt-titulo:    #0f172a;
  --txt-normal:    #334155;
  --txt-suave:     #64748b;
  --txt-muted:     #94a3b8;
  --azul:          #38BDF8;
  --azul-dark:     #1e4d7b;
  --azul-hover:    #185a96;
  --azul-txt:      #0369a1;
  --verde:         #16a34a;
  --rojo:          #dc2626;
  --alerta-bg:     #fee2e2;
  --alerta-txt:    #dc2626;
  --stock-low:     #dc2626;
  --prod-thumb-bg: #f1f5f9;
  --chart-bg:      #ffffff;
  --grid-color:    #f1f5f9;
}

/* ── VARIABLES TEMA OSCURO ── */
.layout.dark-mode {
  --bg-pag:        #0f172a;
  --bg-card:       #1e293b;
  --bg-input:      #334155;
  --borde:         #475569;
  --borde-suave:   #1e293b;
  --txt-titulo:    #f1f5f9;
  --txt-normal:    #cbd5e1;
  --txt-suave:     #94a3b8;
  --txt-muted:     #64748b;
  --azul:          #38BDF8;
  --azul-dark:     #378ADD;
  --azul-hover:    #2563eb;
  --azul-txt:      #7dd3fc;
  --verde:         #86efac;
  --rojo:          #f87171;
  --alerta-bg:     #450a0a;
  --alerta-txt:    #fca5a5;
  --stock-low:     #f87171;
  --prod-thumb-bg: #334155;
  --chart-bg:      #1e293b;
  --grid-color:    #334155;
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
  justify-content: flex-start;
  border-bottom: 1px solid var(--borde);
  gap: 20px;
  transition: background 0.3s, border-color 0.3s;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--txt-titulo);
  white-space: nowrap;
  transition: color 0.3s;
}

.search-icon { width: 15px; object-fit: contain; }

.search-wrap input::placeholder { color: var(--txt-muted); }
.topbar-right { display: flex; align-items: center; gap: 14px; }

.notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-input);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: background 0.3s;
}

.notif-dot {
  width: 8px; height: 8px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid var(--bg-card);
}

/* Estilo general para el avatar en el topbar */
.avatar-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0ea5e9;
  border: 2px solid #38bdf8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default; /* Cambiado de pointer a default */
}



.avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* ── FILTROS ── */
.filters-bar {
  background: var(--bg-card);
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.filters-left { display: flex; gap: 10px; }
.filters-right { display: flex; gap: 10px; }

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--borde);
  background: var(--bg-card);
  font-size: 13px;
  color: var(--txt-normal);
  cursor: pointer;
  transition: all 0.15s;
}

.filter-pill:hover { border-color: var(--azul); color: var(--azul-txt); }
/*Filtros avanzados*/
.filtros-panel-rep {
  background: var(--bg-card);
  border-bottom: 1px solid var(--borde);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  transition: background 0.3s, border-color 0.3s;
}

.filtros-grupo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filtros-titulo {
  font-size: 11px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.filtros-opciones {
  display: flex;
  gap: 6px;
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

.filtro-pill:hover  { border-color: #38BDF8; color: #0369a1; }
.filtro-pill.active { border-color: #38BDF8; background: #e0f2fe; color: #0369a1; font-weight: 600; }

.filtros-limpiar {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--txt-muted);
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.filtros-limpiar:hover { color: #ef4444; }

.export-btn {
  padding: 10px 20px;
  background: var(--azul-dark);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.export-btn:hover { background: var(--azul-hover); }

/* ── CONTENT ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

/* ── SUMMARY CARDS ── */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid var(--borde);
  border-left-width: 4px;
  transition: background 0.3s, border-color 0.3s;
}

.summary-card.border-green { border-left-color: var(--verde); }
.summary-card.border-red   { border-left-color: var(--rojo);  }
.summary-card.border-blue  { border-left-color: var(--azul-dark); }

.summary-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--txt-titulo);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}

.up   { font-size: 12px; font-weight: 600; color: var(--verde); transition: color 0.3s; }
.down { font-size: 12px; font-weight: 600; color: var(--rojo);  transition: color 0.3s; }

.alert-badge {
  font-size: 11px;
  font-weight: 700;
  background: var(--alerta-bg);
  color: var(--alerta-txt);
  padding: 3px 8px;
  border-radius: 6px;
  transition: background 0.3s, color 0.3s;
}

/* ── CHARTS ── */
.charts-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--borde);
  padding: 22px;
  transition: background 0.3s, border-color 0.3s;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 15px; font-weight: 700;
  color: var(--txt-titulo);
  margin-bottom: 4px;
  transition: color 0.3s;
}

.chart-sub {
  font-size: 12px;
  color: var(--txt-muted);
  transition: color 0.3s;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--txt-suave);
  transition: color 0.3s;
}

.legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.legend-dot.dark-blue  { background: #1e4d7b; }
.legend-dot.mid-blue   { background: #378ADD; }
.legend-dot.light-blue { background: #93c5fd; }
.legend-dot.gray       { background: #94a3b8; }

/* ── DONA ── */
.donut-wrap {
  position: relative;
  width: 180px; height: 180px;
  margin: 16px auto;
}

.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-number {
  display: block;
  font-size: 22px; font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.donut-label {
  display: block;
  font-size: 10px;
  color: var(--txt-muted);
  letter-spacing: 0.5px;
  transition: color 0.3s;
}

.category-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

.category-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--txt-normal);
  transition: color 0.3s;
}

.category-name { flex: 1; }

.category-pct {
  font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

/* ── TABLE ── */
.table-card {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--borde);
  padding: 22px;
  margin-bottom: 28px;
  transition: background 0.3s, border-color 0.3s;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px; font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.inventory-link {
  font-size: 13px;
  color: var(--azul-dark);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;
}

.inventory-link:hover { text-decoration: underline; }

table { width: 100%; border-collapse: collapse; }

thead th {
  font-size: 11px; font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 0 0 12px 0; text-align: left;
  border-bottom: 1px solid var(--borde);
  transition: color 0.3s, border-color 0.3s;
}

tbody tr { border-bottom: 1px solid var(--borde-suave); }
tbody tr:last-child { border-bottom: none; }

tbody td {
  padding: 16px 0;
  font-size: 13.5px;
  color: var(--txt-normal);
  vertical-align: middle;
  transition: color 0.3s;
}

.prod-cell { display: flex; align-items: center; gap: 12px; }

.prod-thumb {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--prod-thumb-bg);
  border: 1px solid var(--borde);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.prod-name {
  font-weight: 600;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.cat-cell      { color: var(--txt-normal); transition: color 0.3s; }
.stock-low-cell { font-weight: 700; color: var(--stock-low); transition: color 0.3s; }
.min-cell      { color: var(--txt-muted); transition: color 0.3s; }

.restock-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--borde);
  background: var(--bg-card);
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-normal);
  cursor: pointer;
  transition: all 0.2s;
}

.restock-btn:hover {
  border-color: var(--azul-dark);
  color: var(--azul-dark);
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .content { padding: 16px; }
  .tabla { font-size: 12px; }
  thead th { font-size: 10px; padding: 0 0 10px 0; }
  tbody td { padding: 12px 0; font-size: 12px; }
  .restock-btn { padding: 5px 12px; font-size: 12px; }
  .prod-thumb { width: 32px; height: 32px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .content { padding: 12px; }
  .page-title { font-size: 18px; }
  .tabla-wrapper { overflow-x: auto; }
  .tabla { font-size: 11px; }
  thead th { font-size: 9px; padding: 0 0 8px 0; }
  tbody td { padding: 10px 4px; font-size: 11px; }
  .prod-cell { gap: 8px; }
  .prod-thumb { width: 28px; height: 28px; }
  .prod-name { font-size: 12px; }
  .restock-btn { padding: 4px 10px; font-size: 11px; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  thead th { font-size: 8px; }
  tbody td { padding: 8px 2px; font-size: 10px; }
  .prod-thumb { width: 24px; height: 24px; }
  .restock-btn { padding: 3px 8px; font-size: 10px; }
}
</style>