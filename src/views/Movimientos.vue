<template>
  <div class="mov-layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual"/>

    <!-- MAIN -->
    <div class="mov-main">

      <!-- TOPBAR -->
      <header class="mov-topbar">
        <div class="search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="mov-search-icon" />
          <input v-model="busqueda" type="text" placeholder="Buscar movimientos..." />
        </div>
        <div class="mov-topbar-right">
          <button class="mov-notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
            <span class="mov-notif-dot"></span>
          </button>
          <div class="mov-avatar-btn">
            <img :src="usuarioStore.fotoPerfil" class="mov-avatar-img" />
          </div>
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

// Para mostrar la foto de perfil en el topbar y configuración, usamos el store de usuario //
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

//DARK MODE o modo oscuro
import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

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
    hogar:       '/images/images-dashboard/sofagrande.png',
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

<style scoped>
/* ── VARIABLES TEMA CLARO ── */
.mov-layout {
  --bg-pag:        #f0f2f5;
  --bg-card:       #ffffff;
  --bg-input:      #f1f5f9;
  --bg-input2:     #f1f5f9;
  --borde:         #e5e7eb;
  --borde-suave:   #f1f5f9;
  --txt-titulo:    #0f172a;
  --txt-normal:    #475569;
  --txt-suave:     #64748b;
  --txt-muted:     #94a3b8;
  --txt-placeholder: #cbd5e1;
  --azul:          #38BDF8;
  --azul-dark:     #1e4d7b;
  --azul-hover:    #185a96;
  --azul-txt:      #0369a1;
  --entrada-bg:    #f0fdf4;
  --entrada-borde: #16a34a;
  --entrada-txt:   #15803d;
  --salida-bg:     #fef2f2;
  --salida-borde:  #dc2626;
  --salida-txt:    #dc2626;
  --badge-entrada-bg:  #d1fae5;
  --badge-entrada-txt: #065f46;
  --badge-salida-bg:   #ffe4e6;
  --badge-salida-txt:  #9f1239;
  --prod-thumb-bg: #f1f5f9;
  --stat-green:    #1e4d7b;
  --stat-red:      #dc2626;
  --stat-gray:     #475569;
}

/* ── VARIABLES TEMA OSCURO ── */
.mov-layout.dark-mode {
  --bg-pag:        #0f172a;
  --bg-card:       #1e293b;
  --bg-input:      #334155;
  --bg-input2:     #334155;
  --borde:         #475569;
  --borde-suave:   #334155;
  --txt-titulo:    #f1f5f9;
  --txt-normal:    #cbd5e1;
  --txt-suave:     #94a3b8;
  --txt-muted:     #64748b;
  --txt-placeholder: #475569;
  --azul:          #38BDF8;
  --azul-dark:     #378ADD;
  --azul-hover:    #2563eb;
  --azul-txt:      #7dd3fc;
  --entrada-bg:    #0f2e1a;
  --entrada-borde: #16a34a;
  --entrada-txt:   #86efac;
  --salida-bg:     #450a0a;
  --salida-borde:  #dc2626;
  --salida-txt:    #f87171;
  --badge-entrada-bg:  #14532d;
  --badge-entrada-txt: #86efac;
  --badge-salida-bg:   #450a0a;
  --badge-salida-txt:  #fca5a5;
  --prod-thumb-bg: #334155;
  --stat-green:    #1e4d7b;
  --stat-red:      #dc2626;
  --stat-gray:     #475569;
}

.mov-layout {
  display: flex;
  height: 100vh;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s;
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
  background: var(--bg-card);
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}



.mov-search-icon { width: 15px; height: 15px; object-fit: contain; }
.mov-search-wrap input::placeholder { color: var(--txt-muted); }
.mov-topbar-right { display: flex; align-items: center; gap: 14px; }

.mov-notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-input2);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: background 0.3s;
}

.mov-notif-dot {
  width: 8px; height: 8px;
  background: #dc2626;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid var(--bg-card);
}

.mov-avatar-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--azul);
  border: 2px solid #38bdf8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.mov-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* ── CONTENT ── */
.mov-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

.mov-page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--txt-titulo);
  margin-bottom: 4px;
  transition: color 0.3s;
}

.mov-page-sub {
  font-size: 13px;
  color: var(--txt-suave);
  margin-bottom: 24px;
  max-width: 600px;
  line-height: 1.5;
  transition: color 0.3s;
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
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--borde);
  padding: 22px;
  transition: background 0.3s, border-color 0.3s;
}

.mov-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--txt-titulo);
  margin-bottom: 20px;
  transition: color 0.3s;
}

.mov-title-icon { width: 20px; height: 20px; object-fit: contain; }

/* ── FORMULARIO ── */
.mov-field-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.mov-tipo-row { display: flex; gap: 10px; margin-bottom: 18px; }

.mov-tipo-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid var(--borde);
  background: var(--bg-card);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--txt-muted);
}

.mov-tipo-btn.entrada.active {
  border-color: var(--entrada-borde);
  background: var(--entrada-bg);
  color: var(--entrada-txt);
}

.mov-tipo-btn.salida.active {
  border-color: var(--salida-borde);
  background: var(--salida-bg);
  color: var(--salida-txt);
}

.mov-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--borde);
  border-radius: 8px;
  background: var(--bg-input);
  font-size: 13px;
  color: var(--txt-normal);
  outline: none;
  cursor: pointer;
  margin-bottom: 18px;
  appearance: none;
  transition: background 0.3s, border-color 0.2s, color 0.3s;
}

.mov-select:focus { border-color: var(--azul); }

.mov-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 18px;
}

.mov-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid var(--borde);
  border-radius: 8px;
  padding: 9px 12px;
  background: var(--bg-input);
  transition: background 0.3s, border-color 0.2s;
}

.mov-input-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--txt-normal);
  width: 100%;
}

.mov-input-wrap input::placeholder { color: var(--txt-placeholder); }
.mov-input-wrap:focus-within { border-color: var(--azul); }

.mov-textarea {
  width: 100%;
  border: 1.5px solid var(--borde);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--bg-input);
  font-size: 13px;
  color: var(--txt-normal);
  resize: none;
  outline: none;
  font-family: 'Segoe UI', sans-serif;
  margin-bottom: 20px;
  display: block;
  transition: background 0.3s, border-color 0.2s, color 0.3s;
}

.mov-textarea::placeholder { color: var(--txt-placeholder); }
.mov-textarea:focus { border-color: var(--azul); }

.mov-btn-registrar {
  width: 100%;
  padding: 13px;
  background: var(--azul-dark);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.mov-btn-registrar:hover { background: var(--azul-hover); }

/* ── HISTORIAL ── */
.mov-historial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mov-btn-filtrar {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none;
  font-size: 13px; color: var(--azul-txt);
  font-weight: 600; cursor: pointer;
  transition: color 0.3s;
}

.mov-hist-table { width: 100%; border-collapse: collapse; }

.mov-hist-table thead th {
  font-size: 10px; font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.7px; text-transform: uppercase;
  padding: 0 10px 12px 0; text-align: left;
  border-bottom: 1px solid var(--borde);
  transition: color 0.3s, border-color 0.3s;
}

.mov-hist-table tbody tr { border-bottom: 1px solid var(--borde-suave); }
.mov-hist-table tbody tr:last-child { border-bottom: none; }
.mov-hist-table tbody td { padding: 13px 10px 13px 0; vertical-align: middle; }

.mov-fecha-col {
  font-size: 11px;
  color: var(--txt-muted);
  line-height: 1.5; min-width: 60px;
  transition: color 0.3s;
}

.mov-prod-col  { display: flex; align-items: center; gap: 10px; }

.mov-prod-thumb {
  width: 38px; height: 38px;
  border-radius: 8px;
  background: var(--prod-thumb-bg);
  border: 1px solid var(--borde);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.mov-prod-name {
  font-size: 13px; font-weight: 600;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.mov-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; transition: background 0.3s, color 0.3s; }
.mov-badge.entrada { background: var(--badge-entrada-bg); color: var(--badge-entrada-txt); }
.mov-badge.salida  { background: var(--badge-salida-bg);  color: var(--badge-salida-txt);  }

.mov-qty-col {
  font-size: 15px; font-weight: 700;
  color: var(--txt-titulo);
  text-align: right;
  transition: color 0.3s;
}

.mov-hist-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--borde);
  font-size: 11px;
  color: var(--txt-muted);
  transition: border-color 0.3s, color 0.3s;
}

.mov-pag-arrows { display: flex; gap: 6px; }

.mov-pag-arrow {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid var(--borde);
  background: var(--bg-card);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--txt-normal);
  transition: background 0.2s, border-color 0.2s;
}

.mov-pag-arrow:hover { background: var(--bg-input2); }

/* ── STATS FOOTER ── */
.mov-stats-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-bottom: 28px;
}

.mov-stat-card {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--borde);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: background 0.3s, border-color 0.3s;
}

.mov-stat-circle {
  width: 50px; height: 50px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.mov-stat-circle.green { background: var(--stat-green); }
.mov-stat-circle.red   { background: var(--stat-red);   }
.mov-stat-circle.gray  { background: var(--stat-gray);  }

.mov-stat-label {
  font-size: 10px; font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.7px; text-transform: uppercase;
  margin-bottom: 4px;
  transition: color 0.3s;
}

.mov-stat-value {
  font-size: 26px; font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}
</style>