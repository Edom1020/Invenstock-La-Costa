<template>
  <div :class="{'dark-mode': tema.temaActual === 'oscuro'}">
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useTemaStore } from './stores/tema'

const tema = useTemaStore()
const notificacionesRef = ref(null)

// Proporciona la referencia de notificaciones globalmente
provide('notificacionesGlobal', notificacionesRef)
</script>


