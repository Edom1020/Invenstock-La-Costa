import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuarioStore = defineStore('usuario', () => {
    const fotoPerfil = ref(localStorage.getItem('fotoPerfil-invenstock') || 'https://i.pravatar.cc/150?img=1')

    const cambiarFotoPerfil = (nuevaFoto) => {
        fotoPerfil.value = nuevaFoto
        localStorage.setItem('fotoPerfil-invenstock', nuevaFoto)
    }

    return { fotoPerfil, cambiarFotoPerfil }
})