import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemaStore = defineStore('tema', () => {
    const temaActual = ref(localStorage.getItem('tema-invenstock') || 'claro')

      // Sincroniza el body al cargar la app
  document.body.classList.toggle('dark-mode', temaActual.value === 'oscuro')

    const cambiarTema = (nuevoTema) => {
        temaActual.value = nuevoTema
        localStorage.setItem('tema-invenstock', nuevoTema)
        // Sincroniza el body al cambiar el tema
    document.body.classList.toggle('dark-mode', nuevoTema === 'oscuro')
    }

    



    return { temaActual, cambiarTema }
})