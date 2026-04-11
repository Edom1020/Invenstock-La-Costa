<template>
  <div class="mov-layout">

    <!-- SIDEBAR -->
    <Sidebar/>

    <!-- MAIN -->
    <div class="mov-main">

      <!-- TOPBAR -->
      <header class="mov-topbar">
        <div class="mov-search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="mov-search-icon" />
          <input v-model="busqueda" type="text" placeholder="Buscar movimientos..." />
        </div>
        <div class="mov-topbar-right">
          <button class="mov-notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
            <span class="mov-notif-dot"></span>
          </button>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="mov-content">
        <h1 class="mov-page-title">Movimientos de Inventario</h1>
        <p class="mov-page-sub">
          Gestione las entradas y salidas de stock con precisión y control total sobre el flujo de mercancías.
        </p>

        <!-- GRID PRINCIPAL -->
        <div class="mov-main-grid">

          <!-- ── FORMULARIO NUEVO REGISTRO ── -->
          <div class="mov-card">
            <div class="mov-card-title">
              <img src="/images/images-movimientos/nuevoRegistro.png" class="mov-title-icon" />
              Nuevo Registro
            </div>

            <div class="mov-field-label">Tipo de Movimiento</div>
            <div class="mov-tipo-row">
              <button
                :class="['mov-tipo-btn', 'entrada', tipoActivo === 'entrada' ? 'active' : '']"
                @click="tipoActivo = 'entrada'"
              >
                ↑ ENTRADA
              </button>
              <button
                :class="['mov-tipo-btn', 'salida', tipoActivo === 'salida' ? 'active' : '']"
                @click="tipoActivo = 'salida'"
              >
                ↓ SALIDA
              </button>
            </div>

            <div class="mov-field-label">Producto</div>
            <select v-model="form.producto" class="mov-select">
              <option value="">Seleccionar producto...</option>
              <option v-for="p in productos" :key="p.id" :value="p.id">
                {{ p.nombre }}
              </option>
            </select>

            <div class="mov-two-col">
              <div>
                <div class="mov-field-label">Cantidad</div>
                <div class="mov-input-wrap">
                  <img src="/images/images-dashboard/cajadecuadrotproductos.png"
                    style="width:15px;height:15px;object-fit:contain;opacity:0.5;" />
                  <input v-model="form.cantidad" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <div class="mov-field-label">Fecha</div>
                <div class="mov-input-wrap">
                  <input v-model="form.fecha" type="date" />
                </div>
              </div>
            </div>

            <div class="mov-field-label">Notas / Referencia</div>
            <textarea
              v-model="form.notas"
              class="mov-textarea"
              rows="3"
              placeholder="Reposición de stock semanal..."
            ></textarea>

            <button class="mov-btn-registrar" @click="registrarMovimiento">
              Registrar Movimiento
            </button>
          </div>

          <!-- ── HISTORIAL ── -->
          <div class="mov-card">
            <div class="mov-historial-header">
              <div class="mov-card-title" style="margin-bottom:0;">
                <img src="/images/images-movimientos/historial.png" class="mov-title-icon" />
                Historial de Movimientos
              </div>
              <button class="mov-btn-filtrar">
                <img src="/images/images-movimientos/filtrar.png"
                  style="width:14px;height:14px;object-fit:contain;" />
                Filtrar
              </button>
            </div>

            <table class="mov-hist-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th style="text-align:right;">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mov in historial" :key="mov.id">
                  <td>
                    <div class="mov-fecha-col">{{ mov.fechaFormato }}</div>
                  </td>
                  <td>
                    <div class="mov-prod-col">
                      <div class="mov-prod-thumb">
                        <img :src="getCatIcon(mov.categoria)"
                          style="width:18px;height:18px;object-fit:contain;opacity:0.6;" />
                      </div>
                      <span class="mov-prod-name">{{ mov.producto }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['mov-badge', mov.tipo.toLowerCase()]">
                      {{ mov.tipo.toUpperCase() }}
                    </span>
                  </td>
                  <td class="mov-qty-col">{{ mov.cantidad.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mov-hist-footer">
              <span>Mostrando los últimos 10 registros de un total de 452</span>
              <div class="mov-pag-arrows">
                <button class="mov-pag-arrow">‹</button>
                <button class="mov-pag-arrow">›</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── STATS FOOTER ── -->
        <div class="mov-stats-footer">
          <div class="mov-stat-card">
            <div class="mov-stat-circle green">
              <img src="/images/images-movimientos/entradas.png"
                style="width:26px;height:26px;object-fit:contain;" />
            </div>
            <div>
              <div class="mov-stat-label">Total Entradas Mes</div>
              <div class="mov-stat-value">4,520</div>
            </div>
          </div>
          <div class="mov-stat-card">
            <div class="mov-stat-circle red">
              <img src="/images/images-movimientos/salidas.png"
                style="width:26px;height:26px;object-fit:contain;" />
            </div>
            <div>
              <div class="mov-stat-label">Total Salidas Mes</div>
              <div class="mov-stat-value">1,895</div>
            </div>
          </div>
          <div class="mov-stat-card">
            <div class="mov-stat-circle gray">
              <img src="/images/images-movimientos/balanza.png"
                style="width:26px;height:26px;object-fit:contain;" />
            </div>
            <div>
              <div class="mov-stat-label">Stock Neto Actual</div>
              <div class="mov-stat-value">12,430</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from "../components/Sidebar.vue";

const busqueda = ref('')
const tipoActivo = ref('entrada')

const form = ref({
  producto: '',
  cantidad: '',
  fecha: '',
  notas: '',
})

const productos = ref([
  { id: 1, nombre: 'MacBook Pro M3',        categoria: 'electronica' },
  { id: 2, nombre: 'Sofá grande',            categoria: 'hogar'       },
  { id: 3, nombre: 'Caja de manzanas x40',  categoria: 'comida'      },
  { id: 4, nombre: 'Headphones Studio X',   categoria: 'electronica' },
])

const getCatIcon = (categoria) => {
  const icons = {
    electronica: '/images/images-dashboard/macbookicon.png',
    hogar:       '/images/images-dashboard/sofaicon.png',
    comida:      '/images/images-dashboard/manzanaicon.png',
  }
  return icons[categoria] || '/images/images-dashboard/macbookicon.png'
}

const historial = ref([
  { id: 1, fechaFormato: '14 Mar, 2024', producto: 'MacBook Pro M3',       categoria: 'electronica', tipo: 'Entrada', cantidad: 1250 },
  { id: 2, fechaFormato: '14 Mar, 2024', producto: 'Sofá Grande',           categoria: 'hogar',       tipo: 'Salida',  cantidad: 340  },
  { id: 3, fechaFormato: '13 Mar, 2024', producto: 'Caja Manzanas x40',    categoria: 'comida',      tipo: 'Entrada', cantidad: 500  },
  { id: 4, fechaFormato: '12 Mar, 2024', producto: 'Headphones Studio X',  categoria: 'electronica', tipo: 'Salida',  cantidad: 120  },
])

const registrarMovimiento = () => {
  // Cuando conectes el backend:
  // await fetch('/api/movimientos', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...form.value, tipo: tipoActivo.value })
  // })
  console.log('Registrar:', { ...form.value, tipo: tipoActivo.value })
}
</script>

<style>
/* ============================================
   PALETA DE COLORES — Movimientos.vue
   ============================================
   Azul primario oscuro  : #1e4d7b
   Azul primario medio   : #185a96
   Azul cielo (acento)   : #38BDF8
   Azul claro (hover)    : #e0f2fe
   Azul info texto       : #0369a1

   Verde entrada fondo   : #d1fae5
   Verde entrada texto   : #065f46
   Verde stat círculo    : #1e4d7b  

   Rojo salida fondo     : #ffe4e6
   Rojo salida texto     : #9f1239
   Rojo stat círculo     : #dc2626

   Gris fondo página     : #f0f2f5
   Gris fondo input      : #f8fafc
   Gris borde            : #e5e7eb
   Gris texto secundario : #64748b
   Gris texto muted      : #94a3b8
   Gris stat círculo     : #475569

   Texto principal       : #0f172a
   Blanco                : #ffffff
   ============================================ */

.mov-layout {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
  font-family: 'Segoe UI', sans-serif;
}

/* ── MAIN ── */
.mov-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── TOPBAR ── */
.mov-topbar {
  background: #ffffff;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}
.mov-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 8px 16px;
  width: 360px;
}
.mov-search-icon { width: 15px; height: 15px; object-fit: contain; }
.mov-search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
  width: 100%;
}
.mov-search-wrap input::placeholder { color: #94a3b8; }
.mov-topbar-right { display: flex; align-items: center; gap: 14px; }
.mov-notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.mov-notif-dot {
  width: 8px; height: 8px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid #ffffff;
}
.mov-avatar-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

/* ── CONTENT ── */
.mov-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}
.mov-page-title {
  font-size: 26px;
  font-weight: 700;
  color: #1e4d7b;
  margin-bottom: 4px;
}
.mov-page-sub {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
  max-width: 600px;
  line-height: 1.5;
}

/* ── GRID ── */
.mov-main-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* ── CARD ── */
.mov-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
}
.mov-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}
.mov-title-icon { width: 20px; height: 20px; object-fit: contain; }

/* ── FORMULARIO ── */
.mov-field-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.mov-tipo-row { display: flex; gap: 10px; margin-bottom: 18px; }
.mov-tipo-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  color: #94a3b8;
}
.mov-tipo-btn.entrada.active { border-color: #16a34a; background: #f0fdf4; color: #15803d; }
.mov-tipo-btn.salida.active  { border-color: #dc2626; background: #fef2f2; color: #dc2626; }

.mov-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
  color: #475569;
  outline: none;
  cursor: pointer;
  margin-bottom: 18px;
  appearance: none;
}
.mov-select:focus { border-color: #38BDF8; }

.mov-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
.mov-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 9px 12px;
  background: #f8fafc;
}
.mov-input-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
  width: 100%;
}
.mov-input-wrap input::placeholder { color: #cbd5e1; }
.mov-input-wrap:focus-within { border-color: #38BDF8; }

.mov-textarea {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  font-size: 13px;
  color: #475569;
  resize: none;
  outline: none;
  font-family: 'Segoe UI', sans-serif;
  margin-bottom: 20px;
  display: block;
}
.mov-textarea::placeholder { color: #cbd5e1; }
.mov-textarea:focus { border-color: #38BDF8; }

.mov-btn-registrar {
  width: 100%;
  padding: 13px;
  background: #1e4d7b;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.mov-btn-registrar:hover { background: #185a96; }

/* ── HISTORIAL ── */
.mov-historial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.mov-btn-filtrar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  color: #0369a1;
  font-weight: 600;
  cursor: pointer;
}

.mov-hist-table { width: 100%; border-collapse: collapse; }
.mov-hist-table thead th {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  padding: 0 10px 12px 0;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}
.mov-hist-table tbody tr { border-bottom: 1px solid #f8fafc; }
.mov-hist-table tbody tr:last-child { border-bottom: none; }
.mov-hist-table tbody td { padding: 13px 10px 13px 0; vertical-align: middle; }

.mov-fecha-col { font-size: 11px; color: #94a3b8; line-height: 1.5; min-width: 60px; }
.mov-prod-col  { display: flex; align-items: center; gap: 10px; }
.mov-prod-thumb {
  width: 38px; height: 38px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mov-prod-name { font-size: 13px; font-weight: 600; color: #0f172a; }

.mov-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
.mov-badge.entrada { background: #d1fae5; color: #065f46; }
.mov-badge.salida  { background: #ffe4e6; color: #9f1239; }

.mov-qty-col { font-size: 15px; font-weight: 700; color: #0f172a; text-align: right; }

.mov-hist-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 11px;
  color: #94a3b8;
}
.mov-pag-arrows { display: flex; gap: 6px; }
.mov-pag-arrow {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #475569;
}
.mov-pag-arrow:hover { background: #f1f5f9; }

/* ── STATS FOOTER ── */
.mov-stats-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-bottom: 28px;
}
.mov-stat-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.mov-stat-circle {
  width: 50px; height: 50px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mov-stat-circle.green { background: #1e4d7b; }
.mov-stat-circle.red   { background: #dc2626; }
.mov-stat-circle.gray  { background: #475569; }
.mov-stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.mov-stat-value { font-size: 26px; font-weight: 700; color: #0f172a; }
</style>