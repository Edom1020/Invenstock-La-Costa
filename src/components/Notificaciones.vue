<template>
  <div class="notif-wrapper">

    <!-- BOTÓN CAMPANA -->
    <button class="notif-btn" @click="toggleDropdown">
      <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
      <span v-if="noLeidas > 0" class="notif-dot">{{ noLeidas }}</span>
    </button>

    <!-- DROPDOWN -->
    <div v-if="abierto" class="notif-dropdown">

      <div class="notif-dropdown-header">
        <span class="notif-dropdown-titulo">Notificaciones</span>
        <span class="notif-marcar-todo" @click="marcarTodas">Marcar todas como leídas</span>
      </div>

      <div class="notif-lista">
        <div
          v-for="notif in notificaciones"
          :key="notif.id"
          :class="['notif-item', notif.leida ? 'leida' : '']"
          @click="marcarLeida(notif.id)"
        >
          <div :class="['notif-icono', notif.tipo]">
            <img :src="getIcono(notif.tipo)" style="width:16px;height:16px;object-fit:contain;" />
          </div>
          <div class="notif-texto">
            <div class="notif-titulo">{{ notif.titulo }}</div>
            <div class="notif-desc">{{ notif.descripcion }}</div>
            <div class="notif-tiempo">{{ notif.tiempo }}</div>
          </div>
          <span v-if="!notif.leida" class="notif-punto-azul"></span>
        </div>
      </div>

      <div class="notif-dropdown-footer">
        Ver todas las notificaciones
      </div>

    </div>

    <!-- OVERLAY para cerrar al hacer clic afuera -->
    <div v-if="abierto" class="notif-overlay" @click="abierto = false"></div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const abierto = ref(false)

const toggleDropdown = () => {
  abierto.value = !abierto.value
}

const notificaciones = ref([
  {
    id: 1,
    tipo: 'alerta',
    titulo: 'Stock bajo detectado',
    descripcion: 'Headphones Studio X tiene solo 2 unidades.',
    tiempo: 'Hace 5 min',
    leida: false
  },
  {
    id: 2,
    tipo: 'alerta',
    titulo: 'Stock bajo detectado',
    descripcion: 'Tablet Pro 12.9" tiene solo 4 unidades.',
    tiempo: 'Hace 20 min',
    leida: false
  },
  {
    id: 3,
    tipo: 'entrada',
    titulo: 'Nueva entrada registrada',
    descripcion: 'MacBook Pro M3 — 12 unidades ingresadas.',
    tiempo: 'Hace 1 hora',
    leida: false
  },
  {
    id: 4,
    tipo: 'salida',
    titulo: 'Salida registrada',
    descripcion: 'Sofá grande — 4 unidades despachadas.',
    tiempo: 'Hace 2 horas',
    leida: true
  },
  {
    id: 5,
    tipo: 'sistema',
    titulo: 'Reporte semanal listo',
    descripcion: 'El resumen de inventario del lunes está disponible.',
    tiempo: 'Ayer',
    leida: true
  },
])

const noLeidas = computed(() =>
  notificaciones.value.filter(n => !n.leida).length
)

const marcarLeida = (id) => {
  const notif = notificaciones.value.find(n => n.id === id)
  if (notif) notif.leida = true
}

const marcarTodas = () => {
  notificaciones.value.forEach(n => n.leida = true)
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

// ── FUNCIÓN PARA AGREGAR NOTIFICACIONES PROGRAMÁTICAMENTE ──
const agregarNotificacion = (titulo, descripcion, tipo = 'entrada') => {
  const nuevoId = Math.max(...notificaciones.value.map(n => n.id), 0) + 1
  notificaciones.value.unshift({
    id: nuevoId,
    tipo,
    titulo,
    descripcion,
    tiempo: 'Hace unos segundos',
    leida: false
  })
}

// Exponer la función para que otros componentes puedan usarla
defineExpose({
  agregarNotificacion
})
</script>

<style>
.notif-wrapper {
  position: relative;
}



.notif-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;  /* ← sin "solid" */
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.notif-btn:hover { background: #e2e8f0; }

.notif-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #ffffff;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0 2px;
}


/* DROPDOWN */
.notif-dropdown {
  position: absolute;
  top: 44px; right: 0;
  width: 320px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--borde, #e5e7eb);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 1000;
  overflow: hidden;
}

.notif-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--borde, #e5e7eb);
}

.notif-dropdown-titulo {
  font-size: 14px;
  font-weight: 700;
  color: var(--txt-titulo, #0f172a);
}

.notif-marcar-todo {
  font-size: 11px;
  color: #38BDF8;
  font-weight: 600;
  cursor: pointer;
}

.notif-marcar-todo:hover { text-decoration: underline; }

/* LISTA */
.notif-lista {
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--borde, #f1f5f9);
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: var(--bg-input, #f1f5f9); }
.notif-item.leida { opacity: 0.6; }

.notif-icono {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.notif-icono.alerta  { background: #fee2e2; }
.notif-icono.entrada { background: #dcfce7; }
.notif-icono.salida  { background: #fee2e2; }
.notif-icono.sistema { background: #e0f2fe; }

.notif-texto { flex: 1; }

.notif-titulo {
  font-size: 13px;
  font-weight: 600;
  color: var(--txt-titulo, #0f172a);
  margin-bottom: 2px;
}

.notif-desc {
  font-size: 11px;
  color: var(--txt-suave, #64748b);
  line-height: 1.4;
  margin-bottom: 4px;
}

.notif-tiempo {
  font-size: 10px;
  color: var(--txt-muted, #94a3b8);
  font-weight: 600;
}

.notif-punto-azul {
  width: 8px; height: 8px;
  background: #38BDF8;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

/* FOOTER */
.notif-dropdown-footer {
  padding: 12px 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #38BDF8;
  border-top: 1px solid var(--borde, #e5e7eb);
  cursor: pointer;
}

.notif-dropdown-footer:hover { text-decoration: underline; }

/* OVERLAY */
.notif-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}
</style>