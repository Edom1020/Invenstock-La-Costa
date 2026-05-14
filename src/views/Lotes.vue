<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual" />

    <!-- MAIN -->
    <div class="main">

       <!-- Barra superior -->
      <header class="topbar">
        <div class="topbar-right">
          <Notificaciones />
          <div class="avatar-btn">
            <img :src="usuarioStore.fotoPerfil" class="avatar-img" />
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="content">

        <!-- ENCABEZADO -->
        <div class="page-header">
          <div>
            <h1>Control de Lotes</h1>
            <p>Gestiona el inventario por lotes y fechas de vencimiento</p>
          </div>
          <button class="btn-nuevo" @click="abrirCrearLote">
            + Crear Lote
          </button>
        </div>

        <!-- KPI CARDS -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">TOTAL LOTES</div>
              <div class="kpi-value">{{ lotes.length }}</div>
            </div>
            <div class="kpi-icon-wrap blue">
              <img src="/images/images-lotes/lotes.png" style="width:28px;height:28px;object-fit:contain;" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">LOTES ACTIVOS</div>
              <div class="kpi-value green">{{ lotesActivos }}</div>
            </div>
            <div class="kpi-icon-wrap green">
              <img src="/images/images-lotes/checkicon.png" style="width:28px;height:28px;object-fit:contain;" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">LOTES AGOTADOS</div>
              <div class="kpi-value red">{{ lotesAgotados }}</div>
            </div>
            <div class="kpi-icon-wrap red">
              <img src="/images/images-dashboard/warningtriangular.png" style="width:28px;height:28px;object-fit:contain;" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-left">
              <div class="kpi-label">POR VENCER (30 DÍAS)</div>
              <div class="kpi-value orange">{{ lotesPorVencer }}</div>
            </div>
            <div class="kpi-icon-wrap orange">
              <img src="/images/images-lotes/alertlote.png" style="width:28px;height:28px;object-fit:contain;" />
            </div>
          </div>
        </div>

        <!-- FILTROS Y BÚSQUEDA -->
        <div class="filters-row">
          <div class="search-box">
            <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
            <input 
              v-model="busqueda" 
              type="text" 
              placeholder="Buscar por lote, producto o código..."
              class="search-input"
            />
          </div>
          <select v-model="filtroEstado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="agotado">Agotado</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        <!-- TABLA DE LOTES -->
        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th style="width:100px;">LOTE #</th>
                <th style="width:150px;">PRODUCTO</th>
                <th style="width:100px;">CANTIDAD</th>
                <th style="width:120px;">FECHA ENTRADA</th>
                <th style="width:120px;">FECHA VENCIMIENTO</th>
                <th style="width:100px;">ESTADO</th>
                <th style="width:100px;">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lote in lotesFiltrados" :key="lote.id">
                <td class="lote-num"><strong>{{ lote.numero }}</strong></td>
                <td>
                  <div class="prod-info">
                    <span class="prod-nombre">{{ lote.producto }}</span>
                    <span class="prod-codigo">SKU: {{ lote.sku }}</span>
                  </div>
                </td>
                <td class="cantidad">{{ lote.cantidad }}</td>
                <td class="fecha">{{ formatDate(lote.fechaEntrada) }}</td>
                <td class="fecha">{{ formatDate(lote.fechaVencimiento) }}</td>
                <td>
                  <span :class="['badge-estado', lote.estado]">
                    {{ estadoTexto(lote.estado) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-edit" title="Editar" @click="abrirEditar(lote)">
                      <img src="/images/images-dashboard/editicon.png" style="width:16px;height:16px;object-fit:contain;" />
                    </button>
                    <button class="btn-del" title="Eliminar" @click="confirmarEliminar(lote)">
                      <img src="/images/images-dashboard/delicon.png" style="width:16px;height:16px;object-fit:contain;" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="lotesFiltrados.length === 0" class="empty-state">
            <img src="/images/images-dashboard/cajadecuadrotproductos.png" style="width:48px;height:48px;opacity:0.3;" />
            <p>No hay lotes registrados</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ── MODAL CREAR/EDITAR LOTE ── -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-box">
          <div class="modal-header">
            <h2 class="modal-title">{{ modoEdicion ? 'Editar Lote' : 'Crear Nuevo Lote' }}</h2>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Número de Lote</label>
                <input v-model="loteTrabajo.numero" class="form-input" type="text" placeholder="LOT-001" />
              </div>

              <div class="form-group">
                <label class="form-label">Producto</label>
                <input v-model="loteTrabajo.producto" class="form-input" type="text" placeholder="Nombre del producto" />
              </div>

              <div class="form-group">
                <label class="form-label">SKU</label>
                <input v-model="loteTrabajo.sku" class="form-input" type="text" placeholder="SKU-001" />
              </div>

              <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input v-model.number="loteTrabajo.cantidad" class="form-input" type="number" min="1" />
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Entrada</label>
                <input v-model="loteTrabajo.fechaEntrada" class="form-input" type="date" />
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Vencimiento</label>
                <input v-model="loteTrabajo.fechaVencimiento" class="form-input" type="date" />
              </div>

              <div class="form-group full">
                <label class="form-label">Observaciones</label>
                <textarea v-model="loteTrabajo.observaciones" class="form-input form-textarea" placeholder="Notas adicionales..."></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <button class="btn-guardar" @click="guardarLote">{{ modoEdicion ? 'Actualizar' : 'Crear' }} Lote</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── MODAL CONFIRMAR ELIMINAR ── -->
    <Teleport to="body">
      <div v-if="modalEliminarVisible" class="modal-overlay" @click.self="cerrarEliminar">
        <div class="modal-box modal-box--sm">
          <div class="modal-header">
            <h2 class="modal-title">Eliminar Lote</h2>
            <button class="modal-close" @click="cerrarEliminar">✕</button>
          </div>

          <div class="modal-body">
            <p class="del-mensaje">
              ¿Estás seguro de que deseas eliminar el lote
              <strong>{{ loteAEliminar?.numero }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarEliminar">Cancelar</button>
            <button class="btn-eliminar" @click="eliminarLote">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue"
import { ref, computed } from 'vue'
import { useTemaStore } from '../stores/tema'
import { useUsuarioStore } from '../stores/usuario'
import Notificaciones from "../components/Notificaciones.vue"

const temaStore = useTemaStore()
const usuarioStore = useUsuarioStore()

const busqueda = ref('')
const filtroEstado = ref('')
const modalVisible = ref(false)
const modoEdicion = ref(false)
const modalEliminarVisible = ref(false)
const loteAEliminar = ref(null)

const loteTrabajo = ref({
  numero: '',
  producto: '',
  sku: '',
  cantidad: 0,
  fechaEntrada: '',
  fechaVencimiento: '',
  observaciones: '',
  estado: 'activo'
})

const lotes = ref([
  {
    id: 1,
    numero: 'LOT-001',
    producto: 'MacBook Pro M3',
    sku: 'LAP-APL-003',
    cantidad: 12,
    fechaEntrada: '2024-01-15',
    fechaVencimiento: '2025-01-15',
    estado: 'activo',
    observaciones: 'Lote de ingreso enero'
  },
  {
    id: 2,
    numero: 'LOT-002',
    producto: 'Tablet Pro 12.9"',
    sku: 'TAB-2024-001',
    cantidad: 8,
    fechaEntrada: '2024-02-20',
    fechaVencimiento: '2024-05-20',
    estado: 'activo',
    observaciones: ''
  },
  {
    id: 3,
    numero: 'LOT-003',
    producto: 'Headphones Studio X',
    sku: 'AUD-WRL-505',
    cantidad: 0,
    fechaEntrada: '2023-12-01',
    fechaVencimiento: '2024-12-01',
    estado: 'agotado',
    observaciones: 'Lote completamente vendido'
  },
  {
    id: 4,
    numero: 'LOT-004',
    producto: 'Escritorio Nórdico',
    sku: 'FUR-WAL-120',
    cantidad: 3,
    fechaEntrada: '2024-03-10',
    fechaVencimiento: '2024-06-10',
    estado: 'activo',
    observaciones: 'Poco stock'
  },
])

const lotesFiltrados = computed(() => {
  let lista = lotes.value

  if (filtroEstado.value) {
    lista = lista.filter(l => l.estado === filtroEstado.value)
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(l =>
      l.numero.toLowerCase().includes(q) ||
      l.producto.toLowerCase().includes(q) ||
      l.sku.toLowerCase().includes(q)
    )
  }

  return lista
})

const lotesActivos = computed(() =>
  lotes.value.filter(l => l.estado === 'activo' && l.cantidad > 0).length
)

const lotesAgotados = computed(() =>
  lotes.value.filter(l => l.cantidad === 0).length
)

const lotesPorVencer = computed(() => {
  const hoy = new Date()
  const treintaDias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000)
  return lotes.value.filter(l => {
    const fecha = new Date(l.fechaVencimiento)
    return fecha >= hoy && fecha <= treintaDias && l.cantidad > 0
  }).length
})

const formatDate = (fecha) => {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES')
}

const estadoTexto = (estado) => {
  const textos = {
    activo: 'Activo',
    agotado: 'Agotado',
    vencido: 'Vencido'
  }
  return textos[estado] || estado
}

const abrirCrearLote = () => {
  modoEdicion.value = false
  loteTrabajo.value = {
    numero: '',
    producto: '',
    sku: '',
    cantidad: 0,
    fechaEntrada: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    observaciones: '',
    estado: 'activo'
  }
  modalVisible.value = true
}

const abrirEditar = (lote) => {
  modoEdicion.value = true
  loteTrabajo.value = { ...lote }
  modalVisible.value = true
}

const cerrarModal = () => {
  modalVisible.value = false
  loteTrabajo.value = {}
}

const guardarLote = () => {
  if (modoEdicion.value) {
    const index = lotes.value.findIndex(l => l.id === loteTrabajo.value.id)
    if (index !== -1) {
      lotes.value[index] = { ...loteTrabajo.value }
    }
  } else {
    const nuevoId = Math.max(...lotes.value.map(l => l.id), 0) + 1
    lotes.value.push({
      id: nuevoId,
      ...loteTrabajo.value
    })
  }
  cerrarModal()
}

const confirmarEliminar = (lote) => {
  loteAEliminar.value = lote
  modalEliminarVisible.value = true
}

const eliminarLote = () => {
  lotes.value = lotes.value.filter(l => l.id !== loteAEliminar.value.id)
  cerrarEliminar()
}

const cerrarEliminar = () => {
  modalEliminarVisible.value = false
  loteAEliminar.value = null
}
</script>

<style scoped>
/* ── VARIABLES TEMA CLARO ── */
.layout {
  --bg-pag:        #f0f2f5;
  --bg-card:       #ffffff;
  --bg-input:      #f1f5f9;
  --borde:         #e5e7eb;
  --txt-titulo:    #0f172a;
  --txt-normal:    #334155;
  --txt-suave:     #64748b;
  --txt-muted:     #94a3b8;
  --azul:          #38BDF8;
  --azul-dark:     #1e4d7b;
  --verde:         #16a34a;
  --rojo:          #ef4444;
  --naranja:       #f59e0b;
}

/* ── VARIABLES TEMA OSCURO ── */
.layout.dark-mode {
  --bg-pag:        #0f172a;
  --bg-card:       #1e293b;
  --bg-input:      #334155;
  --borde:         #475569;
  --txt-titulo:    #f1f5f9;
  --txt-normal:    #cbd5e1;
  --txt-suave:     #94a3b8;
  --txt-muted:     #64748b;
  --azul:          #38BDF8;
  --azul-dark:     #378ADD;
  --verde:         #86efac;
  --rojo:          #f87171;
  --naranja:       #fcd34d;
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

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

/* ── PAGE HEADER ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--txt-titulo);
}

.page-header p {
  font-size: 13px;
  color: var(--txt-suave);
  margin-top: 4px;
}

.btn-nuevo {
  background: var(--azul-dark);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-nuevo:hover { background: #185a96; }

/* ── KPI CARDS ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.kpi-card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 20px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.kpi-left { flex: 1; }

.kpi-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--txt-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--txt-titulo);
}

.kpi-value.green { color: var(--verde); }
.kpi-value.red { color: var(--rojo); }
.kpi-value.orange { color: var(--naranja); }

.kpi-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-wrap.blue { background: rgba(56,189,248,0.12); }
.kpi-icon-wrap.green { background: rgba(22,163,74,0.12); }
.kpi-icon-wrap.red { background: rgba(239,68,68,0.12); }
.kpi-icon-wrap.orange { background: rgba(245,158,11,0.12); }

/* ── FILTROS ── */
.filters-row {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--borde);
  border-radius: 10px;
  padding: 10px 14px;
  transition: border-color 0.2s;
}

.search-box:focus-within { border-color: var(--azul); }

.search-icon { width: 16px; height: 16px; opacity: 0.5; }

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--txt-normal);
}

.search-input::placeholder { color: var(--txt-muted); }

.filter-select {
  padding: 10px 14px;
  border: 1px solid var(--borde);
  background: var(--bg-card);
  border-radius: 10px;
  font-size: 13px;
  color: var(--txt-normal);
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus { outline: none; border-color: var(--azul); }

/* ── TABLA ── */
.table-card {
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid var(--borde);
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s;
}

table { width: 100%; border-collapse: collapse; }

thead tr { border-bottom: 1px solid var(--borde); }

thead th {
  font-size: 11px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 14px 16px;
  text-align: left;
  background: var(--bg-pag);
}

tbody tr { border-bottom: 1px solid var(--borde); }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--bg-input); }

tbody td {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--txt-normal);
  vertical-align: middle;
}

.lote-num { font-weight: 600; color: var(--azul); }

.prod-info { display: flex; flex-direction: column; gap: 4px; }
.prod-nombre { font-weight: 600; color: var(--txt-titulo); }
.prod-codigo { font-size: 11px; color: var(--txt-muted); }

.cantidad { font-weight: 600; color: var(--txt-titulo); }
.fecha { color: var(--txt-suave); font-size: 12px; }

.badge-estado {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
}

.badge-estado.activo {
  background: rgba(22, 163, 74, 0.15);
  color: var(--verde);
}

.badge-estado.agotado {
  background: rgba(239, 68, 68, 0.15);
  color: var(--rojo);
}

.badge-estado.vencido {
  background: rgba(245, 158, 11, 0.15);
  color: var(--naranja);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-del {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--borde);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-edit:hover { background: rgba(56, 189, 248, 0.1); border-color: var(--azul); }
.btn-del:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--rojo); }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--txt-muted);
}

.empty-state p { margin-top: 12px; font-size: 14px; }

/* ── MODALES ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: var(--bg-card);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-box--sm { max-width: 380px; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--borde);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--txt-titulo);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--txt-muted);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover { color: var(--txt-titulo); }

.modal-body {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full { grid-column: span 2; }

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--txt-suave);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-input, .form-textarea {
  border: 1px solid var(--borde);
  background: var(--bg-input);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--txt-normal);
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--azul);
}

.form-textarea { min-height: 80px; resize: vertical; }

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--borde);
  justify-content: flex-end;
}

.btn-cancelar, .btn-guardar, .btn-eliminar {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.btn-cancelar {
  background: var(--bg-input);
  color: var(--txt-normal);
}

.btn-cancelar:hover { background: var(--borde); }

.btn-guardar {
  background: var(--azul);
  color: #ffffff;
}

.btn-guardar:hover { background: #0ea5e9; }

.btn-eliminar {
  background: #dc2626;
  color: #ffffff;
}

.btn-eliminar:hover { background: #dc2626; }

.del-mensaje {
  font-size: 14px;
  color: var(--txt-normal);
  line-height: 1.6;
}

.del-mensaje strong { color: var(--txt-titulo); }

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .content { padding: 16px; }
  thead th { font-size: 10px; padding: 10px 12px; }
  tbody td { font-size: 12px; padding: 10px 12px; }
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
  .page-header { flex-direction: column; gap: 12px; align-items: stretch; }
  .btn-nuevo { width: 100%; }
  .kpi-grid { grid-template-columns: 1fr; gap: 12px; }
  .kpi-card { padding: 14px; }
  .kpi-value { font-size: 24px; }
  .kpi-icon-wrap { width: 48px; height: 48px; }
  .filters-row { flex-direction: column; }
  .search-box { max-width: 100%; }
  .filter-select { width: 100%; }
  table { font-size: 12px; }
  thead th { font-size: 9px; padding: 8px 6px; }
  tbody td { font-size: 11px; padding: 8px 6px; }
  .actions { gap: 4px; }
  .btn-edit, .btn-del { width: 26px; height: 26px; }
  .modal-box { width: 95%; max-width: none; }
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full { grid-column: span 1; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-header h1 { font-size: 18px; }
  .kpi-value { font-size: 22px; }
  thead th { font-size: 8px; }
  tbody td { font-size: 10px; }
}
</style>
