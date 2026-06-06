<template>
  <!-- OVERLAY -->
  <div class="modal-overlay" @click.self="$emit('cerrar')">

    <!-- MODAL -->
    <div class="modal-container">

      <!-- HEADER -->
      <div class="modal-header">
        <div class="modal-header-izq">
          <div class="modal-icono">⬇</div>
          <div>
            <h2 class="modal-titulo">Exportar Reporte PDF</h2>
            <p class="modal-subtitulo">Configura y descarga tu reporte personalizado</p>
          </div>
        </div>
        <button class="modal-cerrar" @click="$emit('cerrar')">✕</button>
      </div>

      <!-- SWITCH FILTROS PERSONALIZADOS -->
      <div class="modal-switch-row">
        <div class="modal-switch-info">
          <div class="modal-switch-titulo">Usar filtros personalizados</div>
          <div class="modal-switch-desc">Filtra los datos antes de generar el PDF</div>
        </div>
        <button
          class="modal-toggle"
          :class="{ on: usarFiltros }"
          @click="usarFiltros = !usarFiltros"
        ></button>
      </div>

      <!-- FILTROS (solo si switch activo) -->
      <transition name="filtros-fade">
        <div v-if="usarFiltros" class="modal-filtros">

          <!-- Fechas -->
          <div class="modal-fila-2">
            <div class="modal-campo">
              <label class="modal-label">Fecha desde</label>
              <input v-model="filtros.fechaInicio" type="date" class="modal-input" />
            </div>
            <div class="modal-campo">
              <label class="modal-label">Fecha hasta</label>
              <input v-model="filtros.fechaFin" type="date" class="modal-input" />
            </div>
          </div>

          <!-- Tipo y Categoría -->
          <div class="modal-fila-2">
            <div class="modal-campo">
              <label class="modal-label">Tipo de movimiento</label>
              <div class="modal-select-wrap">
                <select v-model="filtros.tipo" class="modal-select">
                  <option value="todos">Todos</option>
                  <option value="entrada">Entradas</option>
                  <option value="salida">Salidas</option>
                </select>
                <span class="modal-arrow">▾</span>
              </div>
            </div>
            <div class="modal-campo">
              <label class="modal-label">Categoría</label>
              <div class="modal-select-wrap">
                <select v-model="filtros.categoria" class="modal-select">
                  <option value="todas">Todas</option>
                  <option value="electronica">Electrónica</option>
                  <option value="hogar">Hogar</option>
                  <option value="comida">Comida</option>
                </select>
                <span class="modal-arrow">▾</span>
              </div>
            </div>
          </div>

          <!-- Producto y Ordenar -->
          <div class="modal-fila-2">
            <div class="modal-campo">
              <label class="modal-label">Producto</label>
              <input
                v-model="filtros.producto"
                type="text"
                class="modal-input"
                placeholder="Buscar producto..."
              />
            </div>
            <div class="modal-campo">
              <label class="modal-label">Ordenar por</label>
              <div class="modal-select-wrap">
                <select v-model="filtros.orden" class="modal-select">
                  <option value="recientes">Más recientes</option>
                  <option value="antiguos">Más antiguos</option>
                  <option value="mayor">Mayor cantidad</option>
                  <option value="menor">Menor cantidad</option>
                </select>
                <span class="modal-arrow">▾</span>
              </div>
            </div>
          </div>

        </div>
      </transition>

      <!-- DIVIDER -->
      <div class="modal-divider"></div>

      <!-- ENVIAR POR EMAIL -->
      <div class="modal-email-row">
        <div class="modal-switch-row" style="margin-bottom:0;padding:0;border:none;">
          <div class="modal-switch-info">
            <div class="modal-switch-titulo">Enviar PDF al correo</div>
            <div class="modal-switch-desc">Recibirás el reporte en tu bandeja de entrada</div>
          </div>
          <button
            class="modal-toggle"
            :class="{ on: enviarEmail }"
            @click="enviarEmail = !enviarEmail"
          ></button>
        </div>
      </div>

      <transition name="filtros-fade">
        <div v-if="enviarEmail" class="modal-campo" style="padding: 0 24px 16px;">
          <label class="modal-label">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            class="modal-input"
            placeholder="correo@ejemplo.com"
          />
        </div>
      </transition>

      <!-- ERROR -->
      <transition name="filtros-fade">
        <div v-if="errMsg" class="modal-error">{{ errMsg }}</div>
      </transition>

      <!-- FOOTER BOTONES -->
      <div class="modal-footer">
        <button class="modal-btn-cancelar" @click="$emit('cerrar')">
          Cancelar
        </button>
        <button
          class="modal-btn-generar"
          @click="generarPDF"
          :disabled="cargando"
        >
          <span v-if="cargando" class="modal-spinner"></span>
          <span v-else>⬇ Generar PDF</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '../views/api'

const emit = defineEmits(['cerrar'])

const usarFiltros = ref(false)
const enviarEmail = ref(false)
const email = ref('')
const cargando = ref(false)
const errMsg = ref('')

const filtros = reactive({
  fechaInicio: '',
  fechaFin:    '',
  tipo:        'todos',
  categoria:   'todas',
  producto:    '',
  orden:       'recientes',
})

const descargarPDF = (blob) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reporte-invenstock-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const generarPDF = async () => {
  errMsg.value = ''

  if (enviarEmail.value && !email.value.trim()) {
    errMsg.value = 'Por favor ingresa un correo electrónico.'
    return
  }

  cargando.value = true

  try {
    const payload = {
      ...(usarFiltros.value ? filtros : {}),
      email: enviarEmail.value ? email.value.trim() : null
    }

    const res = await api.post('/reportes/pdf', payload, {
      responseType: 'blob'
    })

    descargarPDF(new Blob([res.data], { type: 'application/pdf' }))

    emit('cerrar')

  } catch (error) {
    // Si el backend devuelve JSON de error dentro del blob, leerlo
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text()
      try {
        const json = JSON.parse(text)
        errMsg.value = json.error || 'Error al generar el PDF.'
      } catch {
        errMsg.value = 'Error al generar el PDF.'
      }
    } else {
      errMsg.value = error.response?.data?.error || 'Error al generar el PDF.'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style>
/* OVERLAY */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

/* CONTAINER */
.modal-container {
  background: var(--bg-card, #ffffff);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid var(--borde, #e5e7eb);
  transition: background 0.3s;
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
}

.modal-header-izq {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icono {
  width: 40px; height: 40px;
  background: #e0f2fe;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
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
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid var(--borde, #e5e7eb);
  background: var(--bg-input, #f1f5f9);
  cursor: pointer;
  font-size: 14px;
  color: var(--txt-suave, #64748b);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}

.modal-cerrar:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

/* SWITCH ROW */
.modal-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
}

.modal-switch-titulo {
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.modal-switch-desc {
  font-size: 11px;
  color: var(--txt-muted, #94a3b8);
}

.modal-toggle {
  width: 44px; height: 24px;
  border-radius: 12px;
  background: var(--toggle-off, #cbd5e1);
  border: none; cursor: pointer;
  position: relative; flex-shrink: 0;
  transition: background 0.25s;
  padding: 0;
}

.modal-toggle::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.25s;
}

.modal-toggle.on { background: #0ea5e9; }
.modal-toggle.on::after { transform: translateX(20px); }

/* FILTROS */
.modal-filtros {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
  background: var(--bg-pag, #f0f2f5);
}

.modal-fila-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--txt-muted, #94a3b8);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.modal-input {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: var(--bg-card, #ffffff);
  color: var(--txt-normal, #334155);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus { border-color: #38BDF8; }
.modal-input::placeholder { color: var(--txt-muted, #94a3b8); }

.modal-select-wrap { position: relative; }

.modal-select {
  width: 100%;
  padding: 9px 30px 9px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: var(--bg-card, #ffffff);
  color: var(--txt-normal, #334155);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.modal-select:focus { border-color: #38BDF8; }

.modal-arrow {
  position: absolute; right: 10px; top: 50%;
  transform: translateY(-50%);
  color: var(--txt-suave, #64748b);
  pointer-events: none; font-size: 12px;
}

/* DIVIDER */
.modal-divider {
  height: 1px;
  background: var(--borde, #e5e7eb);
}

/* EMAIL */
.modal-email-row {
  padding: 16px 24px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
}

/* FOOTER */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
}

.modal-btn-cancelar {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-suave, #64748b);
  cursor: pointer;
  transition: all 0.15s;
}

.modal-btn-cancelar:hover {
  background: var(--bg-input, #f1f5f9);
  color: var(--txt-titulo, #0f172a);
}

.modal-btn-generar {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: #1e4d7b;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 130px;
  justify-content: center;
}

.modal-btn-generar:hover:not(:disabled) { background: #185a96; }
.modal-btn-generar:disabled { opacity: 0.6; cursor: not-allowed; }

/* SPINNER */
.modal-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ERROR */
.modal-error {
  margin: 0 24px 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 12px;
  font-weight: 600;
}

/* ANIMACIÓN */
.filtros-fade-enter-active,
.filtros-fade-leave-active {
  transition: all 0.25s ease;
}

.filtros-fade-enter-from,
.filtros-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>