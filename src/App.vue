<template>
  <div :class="{'dark-mode': tema.temaActual === 'oscuro'}">
    <router-view />
  </div>
</template>

<script setup>
import { useTemaStore } from './stores/tema'

const tema = useTemaStore()
</script>
