<template>
  <!-- OVERLAY -->
  <div class="modal-overlay" @click.self="cerrarModal">

    <!-- MODAL -->
    <div class="modal-container">

      <!-- HEADER -->
      <div class="modal-header">
        <div class="modal-header-izq">
          <div class="modal-icono">📦</div>
          <div>
            <h2 class="modal-titulo">Reponer Stock</h2>
            <p class="modal-subtitulo">Incrementa el inventario de este producto</p>
          </div>
        </div>
        <button class="modal-cerrar" @click="cerrarModal">✕</button>
      </div>

      <!-- CONTENIDO -->
      <div class="modal-content">
        
        <!-- PRODUCTO INFO -->
        <div class="producto-info">
          <div class="prod-icon-box">
            <img :src="getCatIcon(producto.categoria)" style="width:32px;opacity:0.7;" />
          </div>
          <div class="prod-details">
            <div class="prod-label">Producto</div>
            <div class="prod-nombre">{{ producto.nombre }}</div>
            <div class="prod-meta">{{ producto.categoria }}</div>
          </div>
        </div>

        <!-- STOCK ACTUAL -->
        <div class="stock-row">
          <div class="stock-item">
            <div class="stock-label">Stock Actual</div>
            <div class="stock-value">{{ producto.enStock }} <span class="stock-unit">unidades</span></div>
          </div>
          <div class="stock-item">
            <div class="stock-label">Mínimo Requerido</div>
            <div class="stock-value min">{{ producto.minimoRequerido }} <span class="stock-unit">unidades</span></div>
          </div>
        </div>

        <!-- SEPARADOR -->
        <div class="modal-divider"></div>

        <!-- CANTIDAD A REPONER -->
        <div class="input-section">
          <label class="input-label">Cantidad a Reponer</label>
          <div class="cantidad-input-wrap">
            <button class="cantidad-btn" @click="decrementarCantidad" :disabled="cantidad <= 1">−</button>
            <input 
              v-model.number="cantidad" 
              type="number" 
              class="cantidad-input" 
              min="1"
              @keydown.enter="reponer"
            />
            <button class="cantidad-btn" @click="incrementarCantidad">+</button>
          </div>
          <div class="cantidad-preview">
            Stock después de reponer: <span class="preview-value">{{ producto.enStock + cantidad }}</span> unidades
          </div>
        </div>

        <!-- ALERTA SI ES GRAN MOVIMIENTO -->
        <div v-if="cantidad >= 100" class="alerta-gran-movimiento">
          <span class="alerta-icono">⚠️</span>
          <span class="alerta-texto">Reposición grande detectada. Se enviará notificación automática.</span>
        </div>

      </div>

      <!-- FOOTER CON BOTONES -->
      <div class="modal-footer">
        <button class="btn-cancelar" @click="cerrarModal">
          Cancelar
        </button>
        <button class="btn-guardar" @click="reponer" :disabled="cargando">
          <span v-if="!cargando">Guardar</span>
          <span v-else>Guardando...</span>
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUsuarioStore } from '../stores/usuario'

const props = defineProps({
  producto: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      nombre: '',
      categoria: '',
      enStock: 0,
      minimoRequerido: 0
    })
  }
})

const emit = defineEmits(['cerrar', 'reponedor-exitoso'])

const cantidad = ref(50)
const cargando = ref(false)
const usuarioStore = useUsuarioStore()

const incrementarCantidad = () => cantidad.value++
const decrementarCantidad = () => {
  if (cantidad.value > 1) cantidad.value--
}

const cerrarModal = () => {
  emit('cerrar')
}

const getCatIcon = (categoria) => {
  const iconos = {
    Electrónica: '/images/images-dashboard/macbookicon.png',
    Hogar:       '/images/images-dashboard/sofagrande.png',
    Comida:      '/images/images-dashboard/manzanaicon.png',
  }
  return iconos[categoria] || '/images/images-dashboard/macbookicon.png'
}

const reponer = async () => {
  if (cantidad.value < 1) {
    alert('La cantidad debe ser mayor a 0')
    return
  }

  cargando.value = true

  try {
    // LLAMAR AL ENDPOINT DEL BACKEND
    const response = await fetch(`/api/productos/${props.producto.id}/reponer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuarioStore.token}`
      },
      body: JSON.stringify({
        cantidad: cantidad.value
      })
    })

    // Leer la respuesta como texto primero
    const responseText = await response.text()
    
    console.log('Response status:', response.status)
    console.log('Response text:', responseText)

    // Intentar parsear como JSON si hay contenido
    let data = null
    if (responseText) {
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.warn('Respuesta no es JSON válido:', e)
        data = {}
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `Error del servidor (${response.status})`)
    }

    // EMITIR EVENTO DE ÉXITO
    emit('reponedor-exitoso', {
      producto: props.producto.nombre,
      cantidad: cantidad.value,
      nuevoStock: data?.stockActual || props.producto.enStock + cantidad.value
    })

    cerrarModal()
  } catch (error) {
    console.error('Error al reponer:', error)
    alert(`Error: ${error.message}`)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* ── OVERLAY ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── MODAL CONTAINER ── */
.modal-container {
  background: var(--bg-card, #ffffff);
  border-radius: 20px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* ── HEADER ── */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
  background: var(--bg-card, #ffffff);
}

.modal-header-izq {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.modal-icono {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.modal-titulo {
  font-size: 16px;
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.modal-subtitulo {
  font-size: 12px;
  color: var(--txt-muted, #94a3b8);
}

.modal-cerrar {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--txt-muted, #94a3b8);
  transition: color 0.2s;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-cerrar:hover {
  color: var(--txt-titulo, #0f172a);
}

/* ── CONTENIDO ── */
.modal-content {
  padding: 24px;
}

/* PRODUCTO INFO */
.producto-info {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-input, #f1f5f9);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.prod-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid var(--borde, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prod-details {
  flex: 1;
}

.prod-label {
  font-size: 11px;
  color: var(--txt-muted, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.prod-nombre {
  font-size: 14px;
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.prod-meta {
  font-size: 12px;
  color: var(--txt-suave, #64748b);
}

/* STOCK ROW */
.stock-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stock-item {
  background: var(--bg-input, #f1f5f9);
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--borde, #e5e7eb);
}

.stock-label {
  font-size: 11px;
  color: var(--txt-muted, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
}

.stock-value {
  font-size: 18px;
  font-weight: 700;
  color: #16a34a;
}

.stock-value.min {
  color: #dc2626;
}

.stock-unit {
  font-size: 11px;
  font-weight: 500;
  color: var(--txt-suave, #64748b);
  margin-left: 4px;
}

/* DIVIDER */
.modal-divider {
  height: 1px;
  background: var(--borde, #e5e7eb);
  margin: 16px 0;
}

/* INPUT SECTION */
.input-section {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 10px;
}

.cantidad-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cantidad-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: var(--bg-input, #f1f5f9);
  font-size: 18px;
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cantidad-btn:hover:not(:disabled) {
  border-color: var(--azul-dark, #1e4d7b);
  color: var(--azul-dark, #1e4d7b);
  background: #e0f2fe;
}

.cantidad-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cantidad-input {
  flex: 1;
  height: 36px;
  border: 1.5px solid var(--borde, #e5e7eb);
  border-radius: 8px;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
  background: var(--bg-card, #ffffff);
  text-align: center;
  transition: all 0.2s;
}

.cantidad-input:focus {
  outline: none;
  border-color: var(--azul-dark, #1e4d7b);
  box-shadow: 0 0 0 3px rgba(30, 77, 123, 0.1);
}

/* CANTIDAD PREVIEW */
.cantidad-preview {
  font-size: 12px;
  color: var(--txt-suave, #64748b);
  background: var(--bg-input, #f1f5f9);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--borde, #e5e7eb);
}

.preview-value {
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
}

/* ALERTA GRAN MOVIMIENTO */
.alerta-gran-movimiento {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 4px;
  font-size: 13px;
}

.alerta-icono {
  font-size: 18px;
  flex-shrink: 0;
}

.alerta-texto {
  color: #991b1b;
  font-weight: 500;
}

/* ── FOOTER ── */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--borde, #e5e7eb);
  background: var(--bg-card, #ffffff);
  justify-content: flex-end;
}

.btn-cancelar {
  padding: 10px 20px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: var(--bg-card, #ffffff);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-normal, #334155);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  border-color: var(--txt-normal, #334155);
  background: var(--bg-input, #f1f5f9);
}

.btn-guardar {
  padding: 10px 20px;
  background: var(--azul-dark, #1e4d7b);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-guardar:hover:not(:disabled) {
  background: var(--azul-hover, #185a96);
}

.btn-guardar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* DARK MODE */
.layout.dark-mode .modal-container {
  --bg-card: #1e293b;
  --bg-input: #334155;
  --borde: #475569;
  --txt-titulo: #f1f5f9;
  --txt-normal: #cbd5e1;
  --txt-suave: #94a3b8;
  --txt-muted: #64748b;
  --azul-dark: #378ADD;
  --azul-hover: #2563eb;
}
</style>
