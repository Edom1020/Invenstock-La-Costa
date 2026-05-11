<template>
  <div :class="{'dark-mode': tema.temaActual === 'oscuro'}">
    <!-- Notificaciones global posicionada en la esquina superior derecha -->
    <div class="notif-global-wrapper">
      <Notificaciones ref="notificacionesRef" />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useTemaStore } from './stores/tema'
import Notificaciones from './components/Notificaciones.vue'

const tema = useTemaStore()
const notificacionesRef = ref(null)

// Proporciona la referencia de notificaciones globalmente
provide('notificacionesGlobal', notificacionesRef)
</script>

<style scoped>
.notif-global-wrapper {
  position: fixed;
  top: 12px;
  right: 60px;
  z-index: 100;
  pointer-events: auto;
}
</style>
