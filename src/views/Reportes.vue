<template>
  <div class="layout">

    <Sidebar />

    <div class="main">

      <!-- TOPBAR -->
      <header class="topbar">
        <h1 class="page-title">Reportes de Gestión</h1>
        <div class="search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
          <input type="text" placeholder="Buscar movimientos..." />
        </div>
        <div class="topbar-right">
          <button class="notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
            <span class="notif-dot"></span>
          </button>
          <div class="avatar-btn" @click="triggerFileInput" title="Cambiar foto de perfil">
            <img v-if="profilePhoto" :src="profilePhoto" class="avatar-img" />
            <span v-else>JD</span>
          </div>
          <input ref="fileInput" type="file" accept="image/*"
            style="display:none" @change="handlePhotoChange" />
        </div>
      </header>

      <!-- FILTROS -->
      <div class="filters-bar">
        <div class="filters-left">
          <button class="filter-pill">📅 Últimos 30 días</button>
          <button class="filter-pill">≡ Filtros Avanzados</button>
        </div>
        <button class="export-btn">⬇ Exportar PDF</button>
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
            <span class="inventory-link" @click="$router.push('/inventario')">
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
              <tr v-for="item in alertasStock" :key="item.id">
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
                  <button class="restock-btn" @click="$router.push('/inventario')">
                    Reponer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import Sidebar from "../components/Sidebar.vue";

// ── AVATAR ──
const profilePhoto = ref(null)
const fileInput = ref(null)
const triggerFileInput = () => fileInput.value.click()
const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (file) profilePhoto.value = URL.createObjectURL(file)
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
* { box-sizing: border-box; margin: 0; padding: 0; }

.layout {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
  font-family: 'Segoe UI', sans-serif;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── TOPBAR ── */
.topbar {
  background: #ffffff;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e4d7b;
  white-space: nowrap;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 8px 16px;
  flex: 1;
  max-width: 340px;
}

.search-icon { width: 15px; object-fit: contain; }

.search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
  width: 100%;
}

.search-wrap input::placeholder { color: #94a3b8; }

.topbar-right { display: flex; align-items: center; gap: 14px; }

.notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}

.notif-dot {
  width: 8px; height: 8px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid #ffffff;
}

.avatar-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #0ea5e9;
  border: 2px solid #38BDF8;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff; font-weight: 600; font-size: 14px;
  overflow: hidden;
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* ── FILTROS ── */
.filters-bar {
  background: #ffffff;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.filters-left { display: flex; gap: 10px; }

.filter-pill {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
}

.filter-pill:hover { border-color: #38BDF8; color: #0369a1; }

.export-btn {
  padding: 10px 20px;
  background: #1e4d7b;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.export-btn:hover { background: #185a96; }

/* ── CONTENT ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

/* ── SUMMARY CARDS ── */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-left-width: 4px;
}

.summary-card.border-green { border-left-color: #16a34a; }
.summary-card.border-red   { border-left-color: #dc2626; }
.summary-card.border-blue  { border-left-color: #1e4d7b; }

.summary-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.up   { font-size: 12px; font-weight: 600; color: #16a34a; }
.down { font-size: 12px; font-weight: 600; color: #dc2626; }

.alert-badge {
  font-size: 11px;
  font-weight: 700;
  background: #fee2e2;
  color: #dc2626;
  padding: 3px 8px;
  border-radius: 6px;
}

/* ── CHARTS ── */
.charts-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.chart-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.chart-sub   { font-size: 12px; color: #94a3b8; }

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #475569;
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

/* DONA */
.donut-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 16px auto;
}

.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-number { display: block; font-size: 22px; font-weight: 700; color: #0f172a; }
.donut-label  { display: block; font-size: 10px; color: #94a3b8; letter-spacing: 0.5px; }

.category-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

.category-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.category-name { flex: 1; }
.category-pct  { font-weight: 700; color: #0f172a; }

/* ── TABLE ── */
.table-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
  margin-bottom: 28px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title { font-size: 16px; font-weight: 700; color: #0f172a; }

.inventory-link {
  font-size: 13px;
  color: #1e4d7b;
  font-weight: 600;
  cursor: pointer;
}

.inventory-link:hover { text-decoration: underline; }

table { width: 100%; border-collapse: collapse; }

thead th {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 0 0 12px 0; text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

tbody tr { border-bottom: 1px solid #f8fafc; }
tbody tr:last-child { border-bottom: none; }
tbody td { padding: 16px 0; font-size: 13.5px; color: #334155; vertical-align: middle; }

.prod-cell  { display: flex; align-items: center; gap: 12px; }
.prod-thumb {
  width: 36px; height: 36px; border-radius: 8px;
  background: #f1f5f9; border: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.prod-name     { font-weight: 600; color: #0f172a; }
.cat-cell      { color: #475569; }
.stock-low-cell { font-weight: 700; color: #dc2626; }
.min-cell      { color: #94a3b8; }

.restock-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.restock-btn:hover { border-color: #1e4d7b; color: #1e4d7b; }
</style>