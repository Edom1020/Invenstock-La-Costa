<template>
  <div class="ai-bot-wrapper">
    <!-- BOTÓN ROBOT -->
    <button class="ai-bot-btn" @click="toggleModal">
      <span class="ai-bot-emoji">🤖</span>
      <span v-if="sugerenciasCount > 0" class="ai-bot-badge">{{ sugerenciasCount }}</span>
    </button>

    <!-- MODAL -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-container">
        <!-- HEADER -->
        <div class="modal-header">
          <div class="modal-header-izq">
            <div class="modal-icono">🤖</div>
            <div>
              <h2 class="modal-titulo">Asistente IA</h2>
              <p class="modal-subtitulo">Recomendaciones inteligentes para tu inventario</p>
            </div>
          </div>
          <button class="modal-cerrar" @click="cerrarModal">✕</button>
        </div>

        <!-- CONTENIDO -->
        <div class="modal-content">
          <!-- LISTA DE SUGERENCIAS -->
          <div v-if="sugerencias.length > 0" class="sugerencias-lista">
            <div
              v-for="(sugerencia, index) in sugerencias"
              :key="index"
              class="sugerencia-item"
              @click="marcarLeida(index)"
              :class="[sugerencia.leida ? 'leida' : '']"
            >
              <div class="sugerencia-icono">
                <span :class="['icono-tipo', sugerencia.tipo]">{{ sugerencia.icono }}</span>
              </div>
              <div class="sugerencia-texto">
                <div class="sugerencia-titulo">{{ sugerencia.titulo }}</div>
                <div class="sugerencia-descripcion">{{ sugerencia.descripcion }}</div>
                <div class="sugerencia-tiempo">{{ sugerencia.tiempo }}</div>
              </div>
              <span v-if="!sugerencia.leida" class="sugerencia-punto"></span>
            </div>
          </div>

          <!-- MENSAJE CUANDO NO HAY SUGERENCIAS -->
          <div v-else class="sin-sugerencias">
            <div class="sin-sugerencias-icono">😊</div>
            <p class="sin-sugerencias-texto">No hay recomendaciones en este momento. ¡Vuelve más tarde!</p>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <button class="btn-actualizar" @click="actualizarSugerencias">
            Actualizar
          </button>
          <button class="btn-marcar-todo" @click="marcarTodoLeido">
            Marcar todo como leído
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const modalAbierto = ref(false)
const sugerencias = ref([])

const toggleModal = () => {
  modalAbierto.value = !modalAbierto.value
  if (modalAbierto.value) {
    // Generar sugerencias al abrir
    generarSugerencias()
  }
}

const cerrarModal = () => {
  modalAbierto.value = false
}

const marcarLeida = (index) => {
  if (sugerencias.value[index]) {
    sugerencias.value[index].leida = true
  }
}

const marcarTodoLeido = () => {
  sugerencias.value.forEach(s => s.leida = true)
}

const actualizarSugerencias = () => {
  generarSugerencias()
}

// Sugerencias simuladas de IA
function generarSugerencias() {
  const ahora = new Date()

  const sugerenciasBase = [
    {
      id: 1,
      tipo: 'alerta',
      icono: '⚠️',
      titulo: 'Stock bajo detectado',
      descripcion: 'Los auriculares inalámbricos tienen solo 3 unidades restantes. ¿Deseas generar una orden de compra?',
      tiempo: 'Hace 2 min',
      leida: false
    },
    {
      id: 2,
      tipo: 'sugerencia',
      icono: '📈',
      titulo: 'Tendencia de ventas',
      descripcion: 'Las ventas de tablets han aumentado un 25% esta semana. Considera aumentar el stock.',
      tiempo: 'Hace 15 min',
      leida: false
    },
    {
      id: 3,
      tipo: 'recordatorio',
      icono: '📅',
      titulo: 'Inventario mensual',
      descripcion: 'Recuerda realizar el conteo físico de inventario para este viernes a las 9:00 AM.',
      tiempo: 'Hoy a las 9:00',
      leida: false
    },
    {
      id: 4,
      tipo: 'oferta',
      icono: '💰',
      titulo: 'Oportunidad de promoción',
      descripcion: 'Los cargadores inalámbricos tienen alto margen. Sugerimos crear un paquete con fundas.',
      tiempo: 'Hace 30 min',
      leida: false
    },
    {
      id: 5,
      tipo: 'mantenimiento',
      icono: '🔧',
      titulo: 'Actualización de sistema',
      descripcion: 'Se recomienda respaldar la base de datos antes de las 2:00 AM para evitar pérdida de datos.',
      tiempo: 'Esta noche',
      leida: false
    }
  ]

  // Simular variabilidad - mostrar diferentes sugerencias cada vez
  const numSugerencias = Math.floor(Math.random() * 3) + 2 // 2-4 sugerencias
  const sugerenciasSeleccionadas = sugerenciasBase
    .sort(() => Math.random() - 0.5)
    .slice(0, numSugerencias)

  sugerencias.value = sugerenciasSeleccionadas.map(s => ({
    ...s,
    tiempo: calcularTiempoRelativo(s.tiempo) // Convertir a formato relativo
  }))
}

function calcularTiempoRelativo(tiempo) {
  // Simplificado - en una app real usarías una librería como day.js
  if (tiempo.includes('Hace')) return tiempo
  if (tiempo.includes('Hoy')) return tiempo
  if (tiempo.includes('Esta noche')) return tiempo
  return 'Hace un momento'
}

const sugerenciasCount = computed(() => {
  return sugerencias.value.filter(s => !s.leida).length
})
</script>

<style>
.ai-bot-wrapper {
  position: relative;
}

.ai-bot-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f9ff; /* Azul muy claro */
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.ai-bot-btn:hover {
  background: #e0f2fe;
  transform: scale(1.05);
}

.ai-bot-emoji {
  font-size: 20px;
}

.ai-bot-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  background: #10b981; /* Verde esmeralda */
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* MODAL ESTILOS - Similar a los modales existentes */
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

.modal-container {
  background: var(--bg-card, #ffffff);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid var(--borde, #e5e7eb);
}

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
  background: #dcfce7; /* Verde claro */
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

.modal-content {
  padding: 24px;
}

.sugerencias-lista {
  max-height: 300px;
  overflow-y: auto;
}

.sugerencia-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--borde, #f1f5f9);
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 12px;
  margin-bottom: 8px;
}

.sugerencia-item:hover {
  background: var(--bg-input, #f1f5f9);
}

.sugerencia-item.leida {
  opacity: 0.7;
}

.sugerencia-icono {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.sugerencia-icono .icono-tipo.alerta {
  background: #fee2e2;
}

.sugerencia-icono .icono-tipo.sugerencia {
  background: #dcfce7;
}

.sugerencia-icono .icono-tipo.recordatorio {
  background: #fffbdd;
}

.sugerencia-icono .icono-tipo.oferta {
  background: #fff5b7;
}

.sugerencia-icono .icono-tipo.mantenimiento {
  background: #e0f2fe;
}

.sugerencia-texto {
  flex: 1;
}

.sugerencia-titulo {
  font-size: 14px;
  font-weight: 600;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.sugerencia-descripcion {
  font-size: 12px;
  color: var(--txt-suave, #64748b);
  line-height: 1.4;
  margin-bottom: 4px;
}

.sugerencia-tiempo {
  font-size: 11px;
  color: var(--txt-muted, #94a3b8);
  font-weight: 600;
}

.sugerencia-punto {
  width: 6px; height: 6px;
  background: #10b981;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 8px;
}

.sin-sugerencias {
  text-align: center;
  padding: 48px 24px;
  color: var(--txt-suave, #64748b);
}

.sin-sugerencias-icono {
  font-size: 48px;
  margin-bottom: 16px;
}

.sin-sugerencias-texto {
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--borde, #e5e7eb);
}

.btn-actualizar,
.btn-marcar-todo {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--borde, #e5e7eb);
  background: var(--bg-input, #f1f5f9);
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-suave, #64748b);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-actualizar:hover,
.btn-marcar-todo:hover {
  background: var(--bg-card, #ffffff);
  color: var(--txt-titulo, #0f172a);
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .ai-bot-btn {
    width: 32px;
    height: 32px;
  }

  .ai-bot-emoji {
    font-size: 18px;
  }

  .ai-bot-badge {
    min-width: 16px;
    height: 16px;
    font-size: 9px;
  }

  .modal-container {
    width: 90%;
    max-width: 400px;
  }
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
}
</style>