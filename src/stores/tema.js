import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemaStore = defineStore('tema', () => {
    const temaActual = ref(localStorage.getItem('tema-invenstock') || 'claro')

    const cambiarTema = (nuevoTema) => {
        temaActual.value = nuevoTema
        localStorage.setItem('tema-invenstock', nuevoTema)
    }

    return { temaActual, cambiarTema }
})