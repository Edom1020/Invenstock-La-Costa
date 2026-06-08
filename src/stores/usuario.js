import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../views/api'

export const useUsuarioStore = defineStore('usuario', () => {
    const fotoPerfil = ref(localStorage.getItem('fotoPerfil-invenstock') || '/images/User/capibara.png')
    const rol = ref(localStorage.getItem('rol-usuario') || '')
    const token = ref(localStorage.getItem('token-auth') || '')
    const estaAutenticado = ref(!!localStorage.getItem('token-auth'))
    const permisos = ref(JSON.parse(localStorage.getItem('permisos-usuario') || '[]'))

    const perfil = ref(JSON.parse(localStorage.getItem('usuario-perfil-invenstock')) || {
        nombre: '',
        correo: '',
        cargo: '',
        ubicacion: ''
    })

    const cambiarFotoPerfil = (nuevaFoto) => {
        fotoPerfil.value = nuevaFoto
        localStorage.setItem('fotoPerfil-invenstock', nuevaFoto)
    }

    const actualizarPerfil = (nuevoPerfil) => {
        perfil.value = { ...nuevoPerfil }
        localStorage.setItem('usuario-perfil-invenstock', JSON.stringify(perfil.value))
    }

    //  LOGIN REAL
    const iniciarSesion = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password })
            const { token: nuevoToken, usuario } = res.data

            token.value = nuevoToken
            rol.value = usuario.rol
            estaAutenticado.value = true
            permisos.value = usuario.permisos || []

            perfil.value = {
                nombre: `${usuario.nombre} ${usuario.apellido || ''}`.trim(),
                correo: usuario.email,
                cargo: usuario.rol,
                ubicacion: usuario.ubicacion || ''
            }

            localStorage.setItem('token-auth', nuevoToken)
            localStorage.setItem('rol-usuario', usuario.rol)
            localStorage.setItem('permisos-usuario', JSON.stringify(usuario.permisos || []))
            localStorage.setItem('usuario-perfil-invenstock', JSON.stringify(perfil.value))

            return { success: true }
        } catch (error) {
            const mensaje = error.response?.data?.error || 'Error al iniciar sesión'
            return { success: false, error: mensaje }
        }
    }

    // REGISTRO REAL
    const registrarse = async (nombre, apellido, email, password, confirmPassword) => {
        try {
            const res = await api.post('/auth/register', { nombre, apellido, email, password, confirmPassword })
            return { success: true }
        } catch (error) {
            const mensaje = error.response?.data?.error || 'Error en el registro'
            return { success: false, error: mensaje }
        }
    }

    //CARGAR PERFIL DESDE BACKEND
    const cargarPerfil = async () => {
        try {
            const res = await api.get('/usuario/perfil')
            // El backend devuelve los datos en res.data.data
            const datos = res.data.data
            perfil.value = {
                nombre: datos.nombre,
                correo: datos.correo,
                cargo: datos.cargo,
                ubicacion: datos.ubicacion
            }
            if (datos.fotoPerfil) {
                fotoPerfil.value = datos.fotoPerfil
            }
            localStorage.setItem('usuario-perfil-invenstock', JSON.stringify(perfil.value))
        } catch (error) {
            console.error('Error al cargar perfil:', error)
        }
    }

    // GUARDAR PERFIL EN BACKEND
    const guardarPerfil = async (nuevosDatos) => {
        try {
            const res = await api.put('/usuario/perfil', {
                nombre: nuevosDatos.nombre,
                cargo: nuevosDatos.cargo,
                ubicacion: nuevosDatos.ubicacion,
                fotoPerfil: nuevosDatos.fotoPerfil || fotoPerfil.value
            })
            actualizarPerfil(nuevosDatos)
            return { success: true }
        } catch (error) {
            return { success: false, error: 'Error al guardar perfil' }
        }
    }

    const cerrarSesion = () => {
        fotoPerfil.value = '/images/User/capibara.png'
        rol.value = ''
        token.value = ''
        estaAutenticado.value = false
        permisos.value = []

        localStorage.removeItem('fotoPerfil-invenstock')
        localStorage.removeItem('rol-usuario')
        localStorage.removeItem('token-auth')
        localStorage.removeItem('usuario-perfil-invenstock')
        localStorage.removeItem('permisos-usuario')
    }

    return {
        fotoPerfil,
        cambiarFotoPerfil,
        rol,
        token,
        estaAutenticado,
        permisos,
        iniciarSesion,
        registrarse,
        cerrarSesion,
        perfil,
        actualizarPerfil,
        cargarPerfil,
        guardarPerfil
    }
})