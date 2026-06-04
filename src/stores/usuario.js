import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuarioStore = defineStore('usuario', () => {
    const fotoPerfil = ref(localStorage.getItem('fotoPerfil-invenstock') || '/images/User/capibara.png')
    const rol = ref(localStorage.getItem('rol-usuario') || '') // 'administrador' o 'usuario'
    const token = ref(localStorage.getItem('token-auth') || '')
    const estaAutenticado = ref(!!localStorage.getItem('token-auth'))

    // Estado del perfil con persistencia
    const perfil = ref(JSON.parse(localStorage.getItem('usuario-perfil-invenstock')) || {
      nombre: 'Ricardo Alcaraz',
      correo: 'r.alcaraz@invenstock.com',
      cargo: 'Administrador de Inventario',
      ubicacion: 'Sede La Costa'
    })

    const cambiarFotoPerfil = (nuevaFoto) => {
        fotoPerfil.value = nuevaFoto
        localStorage.setItem('fotoPerfil-invenstock', nuevaFoto)
    }

    const actualizarPerfil = (nuevoPerfil) => {
      perfil.value = { ...nuevoPerfil }
      localStorage.setItem('usuario-perfil-invenstock', JSON.stringify(perfil.value))
    }

    const iniciarSesion = (email, password, userRole) => {
        // En una aplicación real, aquí harías una llamada a tu backend para validar las credenciales y obtener el rol y token
        // por ahora, simularemos esto con una validación simple y asignaremos un rol basado en el email
        if (email && password) {
            estaAutenticado.value = true
            rol.value = userRole || 'usuario' // Se puede asignar 'administrador' o 'usuario' según el caso
            token.value = 'fake-token-' + Math.random().toString(36).substr(2, 9)

            // Guardar en localStorage para persistencia
            localStorage.setItem('rol-usuario', rol.value)
            localStorage.setItem('token-auth', token.value)

            return true
        }
        return false
    }

    const cerrarSesion = () => {
        fotoPerfil.value = '/images/User/capibara.png'
        rol.value = ''
        token.value = ''
        estaAutenticado.value = false

        // Limpiar localStorage
        localStorage.removeItem('fotoPerfil-invenstock')
        localStorage.removeItem('rol-usuario')
        localStorage.removeItem('token-auth')
        localStorage.removeItem('usuario-perfil-invenstock')
    }

    return {
        fotoPerfil,
        cambiarFotoPerfil,
        rol,
        token,
        estaAutenticado,
        iniciarSesion,
        cerrarSesion,
        perfil,
        actualizarPerfil
    }
})