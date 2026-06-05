<template>
  <div class="mov-layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual"/>

    <!-- MAIN -->
    <div class="mov-main">

      <!-- TOPBAR -->
      <Topbar @buscar="busqueda = $event" />

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
            <select v-model="form.productoId" class="mov-select">
              <option value="">Seleccionar producto...</option>
              <optgroup
                     v-for="cat in productosStore.categorias"
                     :key="cat?.nombre || cat"
                     :label="formatearCategoria(cat)"
                      >
                <option v-for="p in productosStore.productos.filter(prod => (prod.categoria?.nombre || prod.categoria) === cat)" :key="p._id || p.id" :value="p._id || p.id">
                  {{ p.nombre }}
                </option>
              </optgroup>
              <optgroup v-if="productosStore.productos.some(p => !p.categoria || !productosStore.categorias.includes(p.categoria?.nombre || p.categoria))" label="Otros">
                <option v-for="p in productosStore.productos.filter(prod => !prod.categoria || !productosStore.categorias.includes(prod.categoria?.nombre || prod.categoria))" :key="p._id || p.id" :value="p._id || p.id">
                  {{ p.nombre }}
                </option>
              </optgroup>
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

             <!-- Stock disponible -->
              <div v-if="productoSeleccionado && tipoActivo === 'salida'" class="mov-stock-info">
                   <span class="mov-stock-disponible">
                     Stock disponible: <strong>{{ productoSeleccionado.stock }} unidades</strong>
                   </span>
                 </div>
                 
                 <!-- Error -->
                 <div v-if="errorStock" class="mov-error-msg">
                   ⚠ {{ errorStock }}
              </div>
            
            <!-- El botón se deshabilita o se oculta si no tiene permiso -->
            <button 
              class="mov-btn-registrar" 
              @click="registrarMovimiento"
              :disabled="!puede('registrar_movimiento')"
              :style="!puede('registrar_movimiento') ? 'opacity: 0.5; cursor: not-allowed;' : ''"
            >
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
              <button class="mov-btn-filtrar" @click="mostrarFiltros = !mostrarFiltros">
                <img src="/images/images-movimientos/filtrar.png"
                  style="width:14px;height:14px;object-fit:contain;" />
                Filtrar
              </button>
            </div>

             <!-- PANEL DE FILTROS -->
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
                         v-for="cat in categoriasConTodas"
                         :key="cat"
                         :class="['filtro-pill', filtroCategoria === cat ? 'active' : '']"
                         @click="filtroCategoria = cat"
                       >
                          {{ cat === 'Todas' ? 'Todas' : formatearCategoria(cat) }}
                       </span>
                     </div>
                   </div>

                 <button class="filtros-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
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
                <tr v-for="mov in historialFiltrado" :key="mov._id || mov.id">
                  <td>
                    <div class="mov-fecha-col">{{ formatearFecha(mov) }}</div>
                  </td>
                  <td>
                    <div class="mov-prod-col">
                      <div class="mov-prod-thumb">
                        <img :src="getCatIcon(mov.categoria?.nombre || mov.categoria)"
                          style="width:18px;height:18px;object-fit:contain;opacity:0.6;" />
                      </div>
                      <span class="mov-prod-name">{{ mov.producto?.nombre || mov.producto }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['mov-badge', (mov.tipo || '').toLowerCase()]">
                      {{ mov.tipo.toUpperCase() }}
                    </span>
                  </td>
                  <td class="mov-qty-col">{{ mov.cantidad.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mov-hist-footer">
              <span v-if="historialFiltrado.length">Mostrando los últimos {{ historialFiltrado.length }} registros de un total de {{ productosStore.historialMovimientos.length }}</span>
              <span v-else>No hay movimientos que coincidan con los filtros</span>
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
              <div class="mov-stat-value">{{ totalEntradasMes.toLocaleString() }}</div>
            </div>
          </div>
          <div class="mov-stat-card">
            <div class="mov-stat-circle red">
              <img src="/images/images-movimientos/salidas.png"
                style="width:26px;height:26px;object-fit:contain;" />
            </div>
            <div>
              <div class="mov-stat-label">Total Salidas Mes</div>
              <div class="mov-stat-value">{{ totalSalidasMes.toLocaleString() }}</div>
            </div>
          </div>
          <div class="mov-stat-card">
            <div class="mov-stat-circle gray">
              <img src="/images/images-movimientos/balanza.png"
                style="width:26px;height:26px;object-fit:contain;" />
            </div>
            <div>
              <div class="mov-stat-label">Stock Neto Actual</div>
              <div class="mov-stat-value">{{ totalStockNeto }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onActivated, onMounted } from 'vue'
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";


import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

//PRODUCTOS STORE
import { useProductosStore } from '../stores/productos'
const productosStore = useProductosStore()

//DARK MODE o modo oscuro
import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const busqueda = ref('')
const tipoActivo = ref('entrada')

const form = ref({
  productoId: '',
  cantidad: '',
  fecha: new Date().toISOString().split('T')[0],
  notas: '',
})

const errorStock = ref('')

const productoSeleccionado = computed(() =>
  productosStore.productos.find(p => (p._id || p.id) === form.value.productoId) || null
)


const getCatIcon = (categoria) => {
  const icons = {
    electronica: '/images/images-dashboard/macbookicon.png',
    hogar:       '/images/images-dashboard/sofagrande.png',
    comida:      '/images/images-dashboard/manzanaicon.png',
  }
  return icons[categoria] || '/images/images-dashboard/macbookicon.png'
}

const mostrarFiltros = ref(false)
const filtroTipo = ref('Todos')
const filtroCategoria = ref('Todas')

const limpiarFiltros = () => {
  filtroTipo.value = 'Todos'
  filtroCategoria.value = 'Todas'
}

const totalStockNeto = computed(() => {
  return productosStore.productos.reduce((acc, p) => acc + p.stock, 0)
})

const categoriasConTodas = computed(() => {
  return ['Todas', ...productosStore.categorias]
})

const historialFiltrado = computed(() => {
  return productosStore.historialMovimientos.filter(m => {
    const porTipo = filtroTipo.value === 'Todos' || m.tipo === filtroTipo.value
    const porCategoria = filtroCategoria.value === 'Todas' || m.categoria === filtroCategoria.value
    const porBusqueda = String(m.producto?.nombre || m.producto || '').toLowerCase().includes(busqueda.value.toLowerCase())
    return porTipo && porCategoria && porBusqueda
  })
})

// KPIs de Movimientos
const totalEntradasMes = computed(() => {
  const hoy = new Date()
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  return productosStore.historialMovimientos
    .filter(m => new Date(m.fecha) >= primerDiaMes && m.tipo === 'Entrada')
    .reduce((sum, mov) => sum + mov.cantidad, 0)
})

const totalSalidasMes = computed(() => {
  const hoy = new Date()
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  return productosStore.historialMovimientos
    .filter(m => new Date(m.fecha) >= primerDiaMes && m.tipo === 'Salida')
    .reduce((sum, mov) => sum + mov.cantidad, 0)
})

const puede = (permiso) => {
  const perms = usuarioStore.permisos || []
  if (perms.includes('*')) return true
  return perms.includes(permiso)
}

const registrarMovimiento = () => {
  errorStock.value = ''

  if (!form.value.productoId) {
    errorStock.value = 'Selecciona un producto.'
    return
  }
  if (!form.value.cantidad || form.value.cantidad <= 0) {
    errorStock.value = 'Ingresa una cantidad válida.'
    return
  }

  const cantidadNum = Number(form.value.cantidad)

  if (tipoActivo.value === 'salida' && productoSeleccionado.value) {
    if (cantidadNum > productoSeleccionado.value.stock) {
      errorStock.value = `Stock insuficiente. Solo hay ${productoSeleccionado.value.stock} unidades disponibles de "${productoSeleccionado.value.nombre}".`
      return
    }
  }

  // Llama a la acción del store para registrar el movimiento
  const result = productosStore.registrarMovimiento({
    productoId: form.value.productoId,
    cantidad: cantidadNum,
    fecha: form.value.fecha,
    notas: form.value.notas,
    tipo: tipoActivo.value // 'entrada' o 'salida'
  })

  if (result?.error) {
    errorStock.value = result.error
    return
  }

  // Limpiar formulario
  form.value = {
    productoId: '',
    cantidad: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: ''
  }
  errorStock.value = ''
}

const formatearFecha = (mov) => {
  const raw = mov.fechaFormato || mov.fecha || mov.createdAt || ''
  if (!raw) return '-'
  const dt = new Date(raw)
  if (isNaN(dt.getTime())) return raw
  return dt.toLocaleDateString('es-ES')
}

const formatearCategoria = (cat) => {
  const nombre = cat?.nombre || cat || ''
  return String(nombre).charAt(0).toUpperCase() + String(nombre).slice(1)
}

onMounted(async () => {
  await productosStore.cargarProductos()
  await productosStore.cargarMovimientos()
})
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

.mov-stock-info {
  margin-bottom: 10px;
  padding: 8px 12px;
  background: var(--bg-input);
  border-radius: 8px;
  border: 1px solid var(--borde);
}

.mov-stock-disponible {
  font-size: 12px;
  color: var(--txt-suave);
}

.mov-stock-disponible strong {
  color: var(--txt-titulo);
  font-weight: 700;
}

.mov-error-msg {
  margin-bottom: 12px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
}

/* Tema oscuro */
.mov-layout.dark-mode .mov-error-msg {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #f87171;
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .content { padding: 16px; }
  .mov-container { grid-template-columns: 1fr 1fr; gap: 16px; }
  .mov-field-label { font-size: 12px; }
  .mov-field-input { font-size: 13px; padding: 10px; }
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
  .mov-container { grid-template-columns: 1fr; gap: 12px; }
  .mov-field-label { font-size: 11px; }
  .mov-field-input { font-size: 12px; padding: 8px; }
  .mov-stat-value { font-size: 20px; }
  .mov-stat-label { font-size: 9px; }
  button { padding: 10px; font-size: 12px; width: 100%; }
  .mov-stats-footer {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  .mov-stat-value { font-size: 18px; }
  button { padding: 8px; font-size: 11px; }
}

/* Asegurar que las tarjetas se apilen verticalmente en móvil */
@media (max-width: 480px) {
  .mov-main-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>