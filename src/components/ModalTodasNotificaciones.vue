<template>
  <!-- OVERLAY -->
  <div class="modal-overlay" @click.self="$emit('cerrar')">

    <!-- MODAL -->
    <div class="modal-container" :class="{ 'dark-mode': tema === 'oscuro' }">

      <!-- HEADER -->
      <div class="modal-header">
        <div class="modal-header-izq">
          <div class="modal-icono">🔔</div>
          <div>
            <h2 class="modal-titulo">Todas las Notificaciones</h2>
            <p class="modal-subtitulo">Revisa tu historial completo de eventos</p>
          </div>
        </div>
        <button class="modal-cerrar" @click="$emit('cerrar')">✕</button>
      </div>

      <!-- CONTENIDO: Lista de notificaciones -->
      <div class="modal-content">
        <div v-if="notificaciones.length > 0" class="notif-lista-modal">
          <div
            v-for="notif in notificaciones"
            :key="notif.id"
            :class="['notif-item-modal', notif.leida ? 'leida' : '']"
            @click="marcarLeida(notif.id)"
          >
            <div :class="['notif-icono-modal', notif.tipo]">
              <img :src="getIcono(notif.tipo)" style="width:16px;height:16px;object-fit:contain;" />
            </div>
            <div class="notif-texto-modal">
              <div class="notif-titulo-modal">{{ notif.titulo }}</div>
              <div class="notif-desc-modal">{{ notif.descripcion }}</div>
              <div class="notif-tiempo-modal">{{ notif.tiempo }}</div>
            </div>
            <span v-if="!notif.leida" class="notif-punto-azul-modal"></span>
          </div>
        </div>
        <div v-else class="sin-notificaciones">
          <div class="sin-notificaciones-icono">🎉</div>
          <p class="sin-notificaciones-texto">¡Todo tranquilo por aquí! No hay notificaciones.</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn-marcar-todo-modal" @click="marcarTodas">
          Marcar todas como leídas
        </button>
        <button class="btn-cerrar-modal" @click="$emit('cerrar')">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  notificaciones: {
    type: Array,
    required: true
  },
  tema: { // Prop para recibir el tema actual (claro/oscuro)
    type: String,
    default: 'claro'
  }
})

const emit = defineEmits(['cerrar', 'marcar-leida', 'marcar-todas'])

const marcarLeida = (id) => {
  emit('marcar-leida', id)
}

const marcarTodas = () => {
  emit('marcar-todas')
}

const getIcono = (tipo) => {
  const iconos = {
    alerta:  '/images/images-dashboard/warningtriangular.png',
    entrada: '/images/images-movimientos/entradas.png',
    salida:  '/images/images-movimientos/salidas.png',
    sistema: '/images/images-config/alerticon.png',
  }
  return iconos[tipo] || '/images/images-dashboard/warningtriangular.png'
}
</script>

<style scoped>
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
  max-width: 600px; /* Un poco más ancho para más contenido */
  max-height: 90vh; /* Limitar altura para scroll */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid var(--borde, #e5e7eb);
  transition: background 0.3s;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
  flex-shrink: 0;
}

.modal-header-izq {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icono {
  width: 40px; height: 40px;
  background: #e0f2fe; /* Azul claro */
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

/* CONTENIDO */
.modal-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.notif-lista-modal {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-item-modal {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-input, #f8fafc); /* Fondo ligeramente diferente para los ítems */
  border-radius: 12px;
  border: 1px solid var(--borde, #e5e7eb);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  position: relative;
}

.notif-item-modal:hover {
  background: var(--bg-card, #ffffff);
  border-color: #38BDF8;
}

.notif-item-modal.leida {
  opacity: 0.7;
  background: var(--bg-card, #ffffff);
  border-color: var(--borde, #e5e7eb);
}

.notif-icono-modal {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.notif-icono-modal.alerta  { background: #fee2e2; }
.notif-icono-modal.entrada { background: #dcfce7; }
.notif-icono-modal.salida  { background: #fee2e2; }
.notif-icono-modal.sistema { background: #e0f2fe; }

.notif-texto-modal { flex: 1; }

.notif-titulo-modal {
  font-size: 14px;
  font-weight: 600;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.notif-desc-modal {
  font-size: 12px;
  color: var(--txt-suave, #64748b);
  line-height: 1.4;
  margin-bottom: 4px;
}

.notif-tiempo-modal {
  font-size: 11px;
  color: var(--txt-muted, #94a3b8);
  font-weight: 600;
}

.notif-punto-azul-modal {
  width: 8px; height: 8px;
  background: #38BDF8;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.sin-notificaciones {
  text-align: center;
  padding: 48px 24px;
  color: var(--txt-suave, #64748b);
}

.sin-notificaciones-icono {
  font-size: 48px;
  margin-bottom: 16px;
}

.sin-notificaciones-texto {
  font-size: 16px;
}

/* FOOTER */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--borde, #e5e7eb);
  flex-shrink: 0;
}

.btn-marcar-todo-modal,
.btn-cerrar-modal {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-marcar-todo-modal {
  background: var(--bg-input, #f1f5f9);
  border: 1.5px solid var(--borde, #e5e7eb);
  color: var(--txt-suave, #64748b);
}

.btn-marcar-todo-modal:hover {
  background: var(--bg-card, #ffffff);
  color: var(--txt-titulo, #0f172a);
}

.btn-cerrar-modal {
  background: #1e4d7b; /* Azul oscuro */
  color: #ffffff;
  border: none;
}

.btn-cerrar-modal:hover {
  background: #163d5e;
}

/* Ajustes para Dark Mode en el modal */
.modal-container.dark-mode {
  background: var(--bg-card);
  border-color: var(--borde);
}

.modal-container.dark-mode .modal-header {
  border-color: var(--borde);
}

.modal-container.dark-mode .modal-icono {
  background: #1e3a5f; /* Azul más oscuro para el fondo del icono */
}

.modal-container.dark-mode .modal-titulo {
  color: var(--txt-titulo);
}

.modal-container.dark-mode .modal-subtitulo {
  color: var(--txt-muted);
}

.modal-container.dark-mode .modal-cerrar {
  background: var(--bg-input);
  border-color: var(--borde);
  color: var(--txt-suave);
}

.modal-container.dark-mode .modal-cerrar:hover {
  background: #450a0a; /* Rojo oscuro para hover */
  border-color: #7f1d1d;
  color: #f87171;
}

.modal-container.dark-mode .modal-content {
  background: var(--bg-pag); /* Usar el fondo de página para el área de contenido */
}

.modal-container.dark-mode .notif-item-modal {
  background: var(--bg-input);
  border-color: var(--borde);
}

.modal-container.dark-mode .notif-item-modal:hover {
  background: var(--bg-card);
  border-color: #38BDF8;
}

.modal-container.dark-mode .notif-item-modal.leida {
  background: var(--bg-card);
  border-color: var(--borde);
}

.modal-container.dark-mode .notif-icono-modal.alerta  { background: #450a0a; }
.modal-container.dark-mode .notif-icono-modal.entrada { background: #14532d; }
.modal-container.dark-mode .notif-icono-modal.salida  { background: #450a0a; }
.modal-container.dark-mode .notif-icono-modal.sistema { background: #1e3a5f; }

.modal-container.dark-mode .notif-titulo-modal {
  color: var(--txt-titulo);
}

.modal-container.dark-mode .notif-desc-modal {
  color: var(--txt-suave);
}

.modal-container.dark-mode .notif-tiempo-modal {
  color: var(--txt-muted);
}

.modal-container.dark-mode .sin-notificaciones {
  color: var(--txt-suave);
}

.modal-container.dark-mode .modal-footer {
  border-color: var(--borde);
}

.modal-container.dark-mode .btn-marcar-todo-modal {
  background: var(--bg-input);
  border-color: var(--borde);
  color: var(--txt-suave);
}

.modal-container.dark-mode .btn-marcar-todo-modal:hover {
  background: var(--bg-card);
  color: var(--txt-titulo);
}

.modal-container.dark-mode .btn-cerrar-modal {
  background: #378ADD; /* Azul más oscuro para dark mode */
}

.modal-container.dark-mode .btn-cerrar-modal:hover {
  background: #2563eb;
}

/* RESPONSIVE para el modal */
@media (max-width: 600px) {
  .modal-container {
    max-width: 95%;
    margin: 0 10px;
  }
  .modal-header {
    padding: 15px 20px;
  }
  .modal-titulo {
    font-size: 15px;
  }
  .modal-subtitulo {
    font-size: 11px;
  }
  .modal-cerrar {
    width: 28px; height: 28px;
    font-size: 12px;
  }
  .modal-content {
    padding: 12px 16px;
  }
  .notif-item-modal {
    padding: 10px 12px;
    gap: 8px;
  }
  .notif-icono-modal {
    width: 32px; height: 32px;
  }
  .notif-titulo-modal {
    font-size: 13px;
  }
  .notif-desc-modal {
    font-size: 11px;
  }
  .notif-tiempo-modal {
    font-size: 10px;
  }
  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 8px;
  }
  .btn-marcar-todo-modal,
  .btn-cerrar-modal {
    width: 100%;
    padding: 10px 15px;
    font-size: 12px;
  }
}
</style>
