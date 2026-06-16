<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual" />

    <!-- ÁREA PRINCIPAL -->
    <div class="main">

      <!-- Barra superior -->
      <header class="topbar">
        <div class="topbar-right">
          <Notificaciones />
          <div class="avatar-btn">
            <img :src="usuarioStore.fotoPerfil" class="avatar-img" />
          </div>
        </div>
      </header>

      <!-- CONTENIDO -->
      <div class="content">

        <div class="page-header">
          <h1 class="page-title">Configuración</h1>
          <p class="page-subtitle">Gestiona tu perfil y las preferencias del sistema</p>
        </div>

        <!-- Grid de dos columnas -->
        <div class="config-grid">

          <!-- PERFIL -->
          <div class="config-card-perfil">
            <div class="conf-card-title">
              <img src="/images/images-config/perfilicon.png" style="width:16px;height:16px;object-fit:contain;" />
              Perfil de Usuario
            </div>

            <div class="conf-profile">
              <div class="conf-avatar-wrap">
                <img :src="usuarioStore.fotoPerfil" class="conf-avatar" />
                <button class="conf-cam-btn" @click="$refs.fileInput.click()"><img src="/images/images-config/cameraicon.png" style="width:16px;height:16px;object-fit:contain;" /></button>
                <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="cambiarFoto" />
              </div>

              <div class="conf-fields">
                <div class="conf-field">
                  <label class="conf-label">NOMBRE COMPLETO</label>
                  <input v-if="modoEdicion" v-model="perfil.nombre" class="conf-input" />
                  <div v-else class="conf-value">{{ perfil.nombre }}</div>
                </div>
                <div class="conf-field">
                  <label class="conf-label">CORREO ELECTRÓNICO</label>
                  <input v-if="modoEdicion" v-model="perfil.correo" class="conf-input" />
                  <div v-else class="conf-value">{{ perfil.correo }}</div>
                </div>
                <div class="conf-field">
                  <label class="conf-label">CARGO</label>
                  <input v-if="modoEdicion" v-model="perfil.cargo" class="conf-input" />
                  <div v-else class="conf-value">{{ perfil.cargo }}</div>
                </div>
                <div class="conf-field">
                  <label class="conf-label">UBICACIÓN</label>
                  <input v-if="modoEdicion" v-model="perfil.ubicacion" class="conf-input" />
                  <div v-else class="conf-value">{{ perfil.ubicacion }}</div>
                </div>
              </div>
            </div>

            <button class="conf-btn-edit" @click="toggleEdicion">
              {{ modoEdicion ? 'Guardar' : 'Editar Perfil' }}
            </button>
          </div>

          <!-- APARIENCIA -->
          <div class="config-card-appearance">
            <div class="conf-card-title">
              <img src="/images/images-config/lookicon.png" style="width:16px;height:16px;object-fit:contain;" />
              Apariencia
            </div>

            <div class="conf-theme-row">
              <button class="conf-theme-btn" :class="{ active: temaStore.temaActual === 'claro' }" @click="temaStore.cambiarTema('claro')">
                <img src="/images/images-config/lighticon.png" style="width:16px;height:16px;object-fit:contain;" />
                <span>Claro</span>
              </button>
              <button class="conf-theme-btn" :class="{ active: temaStore.temaActual === 'oscuro' }" @click="temaStore.cambiarTema('oscuro')">
                <img src="/images/images-config/darkicon.png" style="width:16px;height:16px;object-fit:contain;" />
                <span>Oscuro</span>
              </button>
              <button class="conf-theme-btn" :class="{ active: temaStore.temaActual === 'sistema' }" @click="temaStore.cambiarTema('sistema')">
                <img src="/images/images-config/sistemicon.png" style="width:16px;height:16px;object-fit:contain;" />
                <span>Sistema</span>
              </button>
            </div>
          </div>

          <!-- INVENTARIO -->
          <div class="config-card">
            <div class="conf-card-title">
              <img src="/images/images-config/inventoryicon.png" style="width:16px;height:16px;object-fit:contain;" />
              Configuración de Inventario
            </div>

            <div class="conf-grid-2">

              <div class="conf-field-group">
                <label class="conf-label">Alertas de stock bajo</label>
                <div class="conf-stock-wrap">
                  <img src="/images/images-dashboard/warningtriangular.png" style="width:16px;height:16px;object-fit:contain;" />
                  <input type="number" v-model.number="inventario.stockMinimoGlobal" class="conf-stock-input" min="0" />
                  <span class="conf-unit">UNIDADES</span>
                </div>
              </div>

              <div class="conf-field-group">
                <label class="conf-label">Unidad de medida por defecto</label>
                <div class="conf-select-wrap">
                  <select v-model="inventario.unidadMedida" class="conf-select">
                    <option value="u">Unidades (u)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="lt">Litros (lt)</option>
                    <option value="caja">Caja</option>
                  </select>
                  <span class="conf-arrow">▾</span>
                </div>
              </div>

            </div>

            <div class="conf-info-note">
              <img src="/images/images-config/alerticon.png" style="width:14px;height:14px;object-fit:contain;" />
              Estas configuraciones afectarán los reportes y alertas del sistema.
            </div>
          </div>

          <!-- NOTIFICACIONES -->
          <div class="config-card-notif">
            <div class="conf-card-title">
              <img src="/images/images-config/notificacionicon.png" style="width:16px;height:16px;object-fit:contain;" />
              Notificaciones
            </div>

            <div class="conf-notif-container">
              <div class="conf-notif-row">
                <div class="conf-notif-info">
                  <div class="conf-notif-title">Avisos por email</div>
                  <div class="conf-notif-desc">Alertas de stock y movimientos</div>
                </div>
                <button
                  class="conf-toggle-btn"
                  :class="{ on: notif.email }"
                  @click="notif.email = !notif.email"
                  aria-label="Toggle email notifications"
                ></button>
              </div>

              <div class="conf-notif-row">
                <div class="conf-notif-info">
                  <div class="conf-notif-title">Notificaciones escritorio</div>
                  <div class="conf-notif-desc">Mensajes emergentes en tiempo real</div>
                </div>
                <button
                  class="conf-toggle-btn"
                  :class="{ on: notif.escritorio }"
                  @click="notif.escritorio = !notif.escritorio"
                  aria-label="Toggle desktop notifications"
                ></button>
              </div>

              <div class="conf-notif-row last">
                <div class="conf-notif-info">
                  <div class="conf-notif-title">Reportes semanales</div>
                  <div class="conf-notif-desc">Resumen de stock cada lunes</div>
                </div>
                <button
                  class="conf-toggle-btn"
                  :class="{ on: notif.reportes }"
                  @click="notif.reportes = !notif.reportes"
                  aria-label="Toggle weekly reports"
                ></button>
              </div>
            </div>
          </div>

          <!-- GESTIÓN DE PERMISOS -->
          <div v-if="puede('gestionar_usuarios')" class="config-card">
            <div v-if="!mostrarPermisos" class="seg-btn" @click="mostrarPermisos = true">
              <div class="seg-izquierda">
                <div class="seg-icono">
                  <img src="/images/images-config/shield.png" style="width:16px;height:16px;object-fit:contain;" />
                </div>
                <div>
                  <div class="conf-notif-title">Gestión de Permisos</div>
                  <div class="conf-notif-desc">Gestionar permisos de usuarios</div>
                </div>
              </div>
              <span class="seg-arrow">›</span>
            </div>

            <div v-else>
              <div class="conf-card-title">
                <img src="/images/images-config/shield.png" style="width:16px;height:16px;object-fit:contain;" />
                Gestión de Permisos
              </div>

              <div class="permiso-container">
               <!-- Selector de Usuario -->
               <div class="permiso-field" style="display:flex; gap:8px; align-items:flex-end;">
                 <div style="flex:1">
                   <label class="permiso-label">Correo electrónico del usuario</label>
                   <input 
                     v-model="usuarioBusqueda" 
                     class="permiso-input" 
                     placeholder="Ej: colaborador@invenstock.com"
                     @keyup.enter="buscarUsuario"
                   />
                 </div>
                 <button class="btn-permisos" style="margin-top:0; width:auto; padding: 0 16px;" @click="buscarUsuario">
                   Buscar
                 </button>
               </div>

                <!-- Lista de Permisos Disponibles -->
                <div class="permiso-lista">
                  <div
                    v-for="permiso in permisosDisponibles"
                    :key="permiso.id"
                    class="permiso-item"
                    :class="{ 'permiso-disabled': !usuarioEncontrado }"
                  >
                    <div class="permiso-info">
                      <img :src="permiso.icono" :alt="permiso.nombre" class="permiso-icono">
                      <div>
                        <div class="permiso-nombre">{{ permiso.nombre }}</div>
                        <div class="permiso-descripcion">{{ permiso.descripcion }}</div>
                      </div>
                    </div>

                    <!-- Switch para activar/desactivar permiso -->
                    <div class="permiso-toggle">
                      <input
                        type="checkbox"
                        :id="`permiso-${permiso.id}`"
                        :disabled="!usuarioEncontrado"
                        :checked="permisosActual.includes(permiso.id)"
                        @change="togglePermiso(permiso.id)"
                      />
                      <label :for="`permiso-${permiso.id}`"></label>
                    </div>
                  </div>
                </div>
                <p v-if="!usuarioEncontrado && usuarioBusqueda" class="mensaje-error-email">⚠️ Usuario no encontrado en el sistema.</p>

                <!-- Botón de Guardar -->
                <button
                  class="btn-permisos"
                  @click="guardarPermisos"
                  :disabled="guardando || !usuarioEncontrado"
                >
                  <span v-if="guardando">Guardando...</span>
                  <span v-else>Guardar Permisos</span>
                </button>

                <!-- Botón de Cancelar -->
                <button class="btn-cancelar-permisos" @click="mostrarPermisos = false">Cancelar</button>

                <!-- Mensaje de éxito/error -->
                <div v-if="mensaje" class="mensaje-operacion" :class="tipoMensaje">
                  {{ mensaje }}
                </div>
              </div>
            </div>
          </div>
                    <!-- SEGURIDAD -->
          <div class="config-card full">
            <!-- BOTÓN (se ve cuando NO está expandido) -->
            <div v-if="!mostrarPassword" class="seg-btn" @click="mostrarPassword = true">
              <div class="seg-izquierda">
                <div class="seg-icono">
                  <img src="/images/images-config/securityicon.png" style="width:16px;height:16px;object-fit:contain;" />
                </div>
                <div>
                  <div class="conf-notif-title">Seguridad</div>
                  <div class="conf-notif-desc">Cambiar contraseña</div>
                </div>
              </div>
              <span class="seg-arrow">›</span>
            </div>
          
            <!-- FORMULARIO (se ve cuando está expandido) -->
            <div v-else>
              <div class="conf-card-title">
                <img src="/images/images-config/securityicon.png" style="width:16px;height:16px;object-fit:contain;" />
                Cambiar Contraseña
              </div>
          
              <form class="conf-password-form" @submit.prevent="cambiarContraseña" autocomplete="on">
                <input type="text" :value="perfil.correo" autocomplete="username" style="display:none" readonly />
                <input
                  v-model="password.actual"
                  type="password"
                  placeholder="Contraseña actual"
                  class="conf-input-password"
                  autocomplete="current-password"
                />
                <input
                  v-model="password.nueva"
                  type="password"
                  placeholder="Nueva contraseña"
                  class="conf-input-password"
                  autocomplete="new-password"
                />
                <input
                  v-model="password.confirmar"
                  type="password"
                  placeholder="Confirmar contraseña"
                  class="conf-input-password"
                  autocomplete="new-password"
                />
                <div style="display:flex; gap:10px;">
                  <button type="submit" class="conf-btn-update">
                    Actualizar Contraseña
                  </button>
                  <button type="button" class="conf-btn-cancelar-pass" @click="mostrarPassword = false">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
                    
        </div>


        <!-- Botones de acción -->
        <div class="action-buttons">
          <button class="btn-cancelar" @click="cancelar">Cancelar</button>
          <button class="btn-primary" @click="guardarCambios">Guardar Cambios</button>
        </div>

        <!-- Toast de resultado -->
        <transition name="toast-fade">
          <div v-if="toast.visible" class="toast-msg" :class="toast.tipo">
            {{ toast.texto }}
          </div>
        </transition>

      </div>
    </div>
  </div>

  

</template>


<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Notificaciones from '../components/Notificaciones.vue'
import api from '../views/api'

// Para mostrar la foto de perfil en el topbar y configuración, usamos el store de usuario //
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()



// Función para cambiar la foto de perfil, actualiza el store de usuario //
const cambiarFoto = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    usuarioStore.cambiarFotoPerfil(url)  
  }
}

const modoEdicion = ref(false)
const correoOriginal = ref('')

const toast = reactive({ visible: false, texto: '', tipo: 'exito' })
let toastTimer = null
const mostrarToast = (texto, tipo = 'exito') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.texto = texto
  toast.tipo = tipo
  toast.visible = true
  toastTimer = setTimeout(() => { toast.visible = false }, 3500)
}

const perfil = reactive({ ...usuarioStore.perfil })

// Usar un store para la configuración de inventario si queremos que persista
import { useConfiguracionStore } from '../stores/configuracion'
const configuracionStore = useConfiguracionStore()
const inventario = configuracionStore.inventario

import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const notif = reactive({ email: true, escritorio: false, reportes: true })

onMounted(async () => {
  if (configuracionStore.notificaciones) {
    Object.assign(notif, configuracionStore.notificaciones)
  }
  correoOriginal.value = perfil.correo

  try {
    const res = await api.get('/auth/preferencias')
    if (res.data) {
      notif.email    = res.data.email    ?? notif.email
      notif.reportes = res.data.reportes ?? notif.reportes
      Object.assign(configuracionStore.notificaciones, notif)
    }
  } catch {
    // Si el endpoint no existe aún, se usan los valores de localStorage
  }
})

// Cuando el usuario activa las notificaciones de escritorio, pedir permiso al navegador
watch(() => notif.escritorio, async (activo) => {
  if (!activo) return
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones de escritorio.')
    notif.escritorio = false
    return
  }
  if (Notification.permission === 'denied') {
    alert('Las notificaciones están bloqueadas en este navegador. Permítelas en la configuración del sitio.')
    notif.escritorio = false
    return
  }
  if (Notification.permission === 'default') {
    const permiso = await Notification.requestPermission()
    if (permiso !== 'granted') {
      notif.escritorio = false
    }
  }
})

const password = reactive({ actual: '', nueva: '', confirmar: '' })

const cambiarContraseña = async () => {
  if (!password.actual || !password.nueva || !password.confirmar) {
    mostrarToast('Por favor completa todos los campos.', 'error')
    return
  }
  if (password.nueva !== password.confirmar) {
    mostrarToast('Las contraseñas no coinciden.', 'error')
    return
  }
  if (password.nueva.length < 6) {
    mostrarToast('La contraseña debe tener al menos 6 caracteres.', 'error')
    return
  }
  try {
    await api.put('/auth/change-password', {
      passwordActual: password.actual,
      passwordNueva: password.nueva
    })
    mostrarToast('¡Contraseña actualizada exitosamente!')
    password.actual = ''
    password.nueva = ''
    password.confirmar = ''
    mostrarPassword.value = false
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error || 'Error al cambiar la contraseña.'
    mostrarToast(msg, 'error')
  }
}

//Mostrar contraseña en formulario de seguridad
const mostrarPassword = ref(false)
const mostrarPermisos = ref(false)


/**
 * DATOS REACTIVOS PARA LA GESTIÓN DE PERMISOS
 * ========================================================================
 */

// Lista de usuarios del sistema 
const usuarios = ref([])
const usuarioBusqueda = ref('')
const guardando = ref(false)
const mensaje = ref('')
const tipoMensaje = ref('')


const buscarUsuario = async () => {
  if (!usuarioBusqueda.value) return
  mensaje.value = ''
  tipoMensaje.value = ''
  try {
    const res = await api.get(`/admin/permissions?email=${usuarioBusqueda.value}`)
    const data = res.data
    const existe = usuarios.value.find(u => u.email === usuarioBusqueda.value)
    if (!existe) {
      usuarios.value.push({
        nombre: data.nombre,
        email: usuarioBusqueda.value,
        permisos: data.permisos || []
      })
    }
  } catch (error) {
    if (error.response?.status === 404) {
      mensaje.value = '⚠️ Usuario no encontrado en el sistema.'
    } else {
      mensaje.value = 'Error al buscar el usuario.'
    }
    tipoMensaje.value = 'error'
  }
}

// Permisos disponibles que se pueden otorgar
const permisosDisponibles = ref([
  {
    id: 'crear_producto',
    nombre: 'Crear Productos',
    icono: '/images/images-config/add.png',
    descripcion: 'Permite agregar nuevos productos al inventario'
  },
  {
    id: 'editar_producto',
    nombre: 'Editar Productos',
    icono: '/images/images-config/editc.png',
    descripcion: 'Permite modificar productos y lotes existentes'
  },
  {
    id: 'eliminar_producto',
    nombre: 'Eliminar Productos',
    icono: '/images/images-config/delete.png',
    descripcion: 'Permite eliminar productos y lotes del sistema'
  },
  {
    id: 'crear_lote',
    nombre: 'Crear Lotes',
    icono: '/images/images-config/lots.png',
    descripcion: 'Permite registrar nuevos lotes de productos'
  },
  {
    id: 'registrar_movimiento',
    nombre: 'Registrar Movimientos',
    icono: '/images/images-movimientos/nuevoRegistro.png',
    descripcion: 'Permite registrar entradas y salidas de stock manuales'
  },
  {
    id: 'gestionar_usuarios',
    nombre: 'Gestionar Usuarios',
    icono: '/images/images-config/users.png',
    descripcion: 'Permite crear, modificar y eliminar otros usuarios'
  }
])



/**
 * FUNCIONES PARA LA GESTIÓN DE PERMISOS
 * ========================================================================
 */

/**
 * Carga los permisos del usuario seleccionado cuando cambia la selección
 * Esto asegura que siempre veamos los permisos actuales del usuario
 */
const usuarioEncontrado = computed(() => {
  return !!usuarios.value.find(u => u.email === usuarioBusqueda.value)
})

function cargarPermisosUsuario() {
  const usuario = usuarios.value.find(u => u.email === usuarioBusqueda.value)
  if (usuario) {
    console.log(`Cargando permisos para ${usuario.nombre}:`, usuario.permisos)
  }
}

/**
 * Alterna un permiso específico para el usuario seleccionado
 * @param {string} permisoId - ID del permiso a activar/desactivar
 */
function togglePermiso(permisoId) {
  const usuario = usuarios.value.find(u => u.email === usuarioBusqueda.value)
  if (!usuario) return

  const indice = usuario.permisos.indexOf(permisoId)
  if (indice > -1) {
    usuario.permisos.splice(indice, 1)
  } else {
    usuario.permisos.push(permisoId)
  }
}

/**
 * Guarda los cambios de permisos en el backend
 * En una aplicación real, aquí enviaría los datos al servidor
 */
async function guardarPermisos() {
  guardando.value = true
  mensaje.value = ''
  tipoMensaje.value = ''
  try {
    const usuarioActualizado = usuarios.value.find(u => u.email === usuarioBusqueda.value)
    if (!usuarioActualizado) return

    await api.put('/admin/permissions', {
      email: usuarioBusqueda.value,
      permisos: usuarioActualizado.permisos
    })

    mensaje.value = `Permisos actualizados correctamente para ${usuarioActualizado.nombre}`
    tipoMensaje.value = 'exito'

    if (usuarioStore.perfil?.correo === usuarioBusqueda.value) {
      usuarioStore.permisos = [...usuarioActualizado.permisos]
    }
  } catch (error) {
    mensaje.value = 'Error al guardar los permisos. Por favor inténtalo nuevamente.'
    tipoMensaje.value = 'error'
  } finally {
    guardando.value = false
  }
}

/**
 * Computed para obtener los permisos actuales del usuario seleccionado
 * Útil para mostrar información adicional o validaciones
 */
const permisosActual = computed(() => {
  const usuario = usuarios.value.find(u => u.email === usuarioBusqueda.value)
  return usuario ? usuario.permisos : []
})

/**
 * Función para verificar si un usuario tiene un permiso específico
 * Esta función sería utilizada en otros componentes para restringir acceso
 * @param {string} permisoId - ID del permiso a verificar
 * @returns {boolean} - True si el usuario tiene el permiso
 */
const puede = (permisoId) => {
  // El administrador global siempre tiene permiso
  if (usuarioStore.rol === 'administrador' || usuarioStore.rol === 'admin') return true
  
  // Si no es admin, revisamos su lista de permisos en el store
  const permisosUser = usuarioStore.permisos || []
  return permisosUser.includes(permisoId)
}

const esAdmin = computed(() => {
  return usuarioStore.rol === 'administrador' || usuarioStore.rol === 'admin'
})

const toggleEdicion = async () => {
  if (!modoEdicion.value) {
    correoOriginal.value = perfil.correo
    modoEdicion.value = true
  } else {
    await guardarCambios()
  }
}

const cancelar = () => {
  Object.assign(perfil, usuarioStore.perfil)
  Object.assign(inventario, configuracionStore.inventario)
  Object.assign(notif, configuracionStore.notificaciones)
  modoEdicion.value = false
}

const guardarCambios = async () => {
  Object.assign(configuracionStore.notificaciones, notif)

  // Sincronizar preferencias de email/reportes con el backend
  try {
    await api.put('/auth/preferencias', { email: notif.email, reportes: notif.reportes })
  } catch (e) {
    console.warn('No se pudieron guardar las preferencias en el servidor:', e?.response?.data)
  }

  if (perfil.correo !== correoOriginal.value) {
    try {
      await api.put('/auth/change-email', {
        emailNuevo: perfil.correo,
        emailAnterior: correoOriginal.value
      })
      correoOriginal.value = perfil.correo
      usuarioStore.actualizarPerfil(perfil)
      modoEdicion.value = false
      mostrarToast('Correo actualizado. Se envió una notificación al correo anterior.')
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al cambiar el correo.'
      mostrarToast(msg, 'error')
    }
    return
  }

  usuarioStore.actualizarPerfil(perfil)
  modoEdicion.value = false
  mostrarToast('¡Configuración guardada!')
}
</script>


<style scoped>
/* ── VARIABLES ── */
.layout {
  --bg-pag:     #f0f2f5;
  --bg-card:    #ffffff;
  --bg-sidebar: #ffffff;
  --bg-topbar:  #ffffff;
  --bg-input:   #f1f5f9;
  --borde:      #e5e7eb;
  --txt-titulo: #0f172a;
  --txt-normal: #334155;
  --txt-suave:  #64748b;
  --txt-muted:  #94a3b8;
  --azul:       #38bdf8;
  --azul-dark:  #1e4e78;
  --toggle-on:  #0ea5e9;
  --toggle-off: #cbd5e1;
  --thumb:      #ffffff;
}

.layout.dark-mode {
  --bg-pag:     #0f172a;
  --bg-card:    #1e293b;
  --bg-sidebar: #1e293b;
  --bg-topbar:  #1e293b;
  --bg-input:   #334155;
  --borde:      #334155;
  --txt-titulo: #f1f5f9;
  --txt-normal: #cbd5e1;
  --txt-suave:  #94a3b8;
  --txt-muted:  #64748b;
  --toggle-off: #475569;
  --thumb:      #f1f5f9;
}

/* ── LAYOUT PRINCIPAL ── */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s;
}

/* ── COLUMNA PRINCIPAL ── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto; 
}

.avatar-btn {
  margin-left: auto;
  width: 32px; height: 32px; border-radius: 50%;
  background: #0ea5e9; border: 2px solid #38bdf8;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }


.content {
  flex: 1;
  overflow-y: auto;
  padding: 18px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-header { flex-shrink: 0; }
.page-title {
  font-size: 22px; font-weight: 700;
  color: var(--txt-titulo); margin-bottom: 2px;
  transition: color 0.3s;
}
.page-subtitle { font-size: 13px; color: var(--txt-suave); transition: color 0.3s; }

/* ── GRID PRINCIPAL ── */
.config-grid {
  display: grid;
  grid-template-columns: minmax(300px, 650px) minmax(250px, 320px);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
  align-items: start;
}

/* ── CARDS ── */
.config-card {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap : 14px;
}


/* ── TÍTULOS DE CARD ── */
.conf-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 14px;
  color: var(--txt-titulo);
  margin-bottom: 14px;
  transition: color 0.3s;
}

.conf-card-title svg {
  color: var(--azul-dark);
  flex-shrink: 0;
}

/* ── PERFIL ── */
.config-card-perfil {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  flex-direction: column;
  display: flex;
  min-height: 300px;
}

.conf-profile {
  display: flex;
  gap: 14px;
  margin-bottom: 12px;
}

.conf-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.conf-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid var(--borde);
  transition: border-color 0.3s;
}

.conf-cam-btn {
  position: absolute;
  bottom: 45px;
  right: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1.5px solid var(--borde);
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.conf-cam-btn:hover {
  background: var(--bg-input);
}

.conf-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.conf-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.conf-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  transition: color 0.3s;
  word-break: break-word;
  line-height: 1.2;
}

.conf-value,
.conf-input {
  font-size: 12px;
  color: var(--txt-normal);
  background: var(--bg-input);
  padding: 8px 10px;
  border-radius: 6px;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.conf-input {
  border: 1.5px solid var(--azul);
  outline: none;
  font-family: inherit;
}

.conf-input:focus {
  border-color: var(--azul-dark);
  background: var(--bg-input);
}

.conf-btn-edit {
  background: var(--azul-dark);
  color: #fff;
  border: none;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.2s;
  height: 40px;
  margin-top: auto;
}

.conf-btn-edit:hover {
  background: #163d5e;
}

.email-validation-alert {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.btn-verify-sim {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-verify-sim:hover {
  background: #d97706;
}

/* ── APARIENCIA ── */
.config-card-appearance {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  min-height: 300px;
}

.conf-theme-row {
  display: flex;
  gap: 10px;
}

.conf-theme-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid var(--borde);
  background: var(--bg-input);
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.2s, background 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.conf-theme-btn span {
  font-size: 11px;
  font-weight: 600;
  color: var(--txt-suave);
}

.conf-theme-btn.active {
  border-color: var(--azul);
  background: var(--bg-card);
}

.conf-theme-btn.active span {
  color: var(--azul);
}

/* ── INVENTARIO ── */
.conf-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 10px;
}

.conf-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.conf-stock-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border-radius: 8px;
  padding: 8px 10px;
  transition: background 0.3s;
}

.conf-stock-input {
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: var(--txt-titulo);
  outline: none;
  width: 50px;
  font-family: inherit;
  transition: color 0.3s;
}

.conf-unit {
  font-size: 10px;
  font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.4px;
  margin-left: auto;
  transition: color 0.3s;
}

.conf-select-wrap {
  position: relative;
}

.conf-select {
  width: 100%;
  padding: 8px 30px 8px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--borde);
  background: var(--bg-input);
  color: var(--txt-normal);
  font-size: 12px;
  font-family: inherit;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.conf-select:focus {
  border-color: var(--azul);
}

.conf-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--txt-suave);
  pointer-events: none;
  font-size: 12px;
}

.conf-info-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--bg-input);
  border-radius: 50px;
  padding: 20px 20px;
  font-size: 12px;
  color: var(--txt-suave);
  line-height: 1.4;
  transition: background 0.3s, color 0.3s;
  margin-top: auto;
  height: 50px;
}



/* ── NOTIFICACIONES ── */
.config-card-notif {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  min-height: 300px;


}

.conf-notif-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.conf-notif-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--borde);
  gap: 12px;
  transition: border-color 0.3s;
}

.conf-notif-row.last {
  border-bottom: none;
}

.conf-notif-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.conf-notif-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.conf-notif-desc {
  font-size: 11px;
  color: var(--txt-muted);
  transition: color 0.3s;
}

/* ── TOGGLE SWITCH ── */
.conf-toggle-btn {
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background: var(--toggle-off);
  border: none;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background 0.25s;
  padding: 0;
  display: flex;
  align-items: center;
}

.conf-toggle-btn::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--thumb);
  transition: transform 0.25s;
}

.conf-toggle-btn.on {
  background: var(--toggle-on);
}

.conf-toggle-btn.on::after {
  transform: translateX(18px);
}

.conf-toggle-btn:hover {
  opacity: 0.9;
}

/* ── CONTRASEÑA ── */

.conf-password-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.conf-input-password {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--borde);
  background: var(--bg-input);
  color: var(--txt-normal);
  font-size: 12px;
  font-family: inherit;
  outline: none;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.conf-input-password:focus {
  border-color: var(--azul);
  background: var(--bg-input);
}

.conf-input-password::placeholder {
  color: var(--txt-muted);
}

.seg-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 14px;
  transition: background 0.2s;
}

.seg-btn:hover { background: var(--bg-input); }

.seg-izquierda {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seg-icono {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--bg-input);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s;
}

.seg-arrow {
  font-size: 20px;
  color: var(--txt-muted);
}

.conf-btn-cancelar-pass {
  background: transparent;
  color: var(--txt-suave);
  border: 1.5px solid var(--borde);
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  transition: color 0.2s, border-color 0.2s;
}

.conf-btn-cancelar-pass:hover {
  color: var(--txt-titulo);
  border-color: var(--txt-normal);
}

.conf-btn-update {
  background: var(--azul-dark);
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  max-width: 300px;
  display: block;
  margin: 0 auto;
}

.conf-btn-update:hover {
  background: #163d5e;
}

.action-buttons{
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  padding-bottom: 20px;
}

.btn-primary, .btn-cancelar {
  background: var(--azul-dark);
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1e4d7b;
}

.btn-cancelar {
  background: #cbd5e1;
  color: #334155;
}

.btn-cancelar:hover {
  background: #94a3b8;
}

.layout.dark-mode .btn-cancelar {
  background: #475569;
  color: #f1f5f9;
}

.layout.dark-mode .btn-cancelar:hover {
  background: #64748b;
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .content { padding: 16px; }
  .conf-container { grid-template-columns: 1fr; }
  .conf-field { margin-bottom: 12px; }
  input, textarea { font-size: 13px; padding: 10px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .layout {
    flex-direction: column;
  }

  .main {
    width: 100%;
  }

  .content { padding: 12px; }
  .page-title { font-size: 18px; }
  .config-grid { grid-template-columns: 1fr; gap: 12px; }
  .conf-container { grid-template-columns: 1fr; }
  .conf-field { margin-bottom: 10px; }
  .conf-fields { grid-template-columns: 1fr; gap: 12px; }
  input, textarea { font-size: 12px; padding: 8px; width: 100%; }
  .conf-label { font-size: 11px; }
  .btn-primary, .btn-cancelar { padding: 10px 16px; font-size: 12px; width: 100%; }
  .action-buttons { gap: 10px; }
  .conf-btn-update { width: 100%; }
  /* Asegurar que las tarjetas se apilen verticalmente en móvil */
  .config-card.full {
    grid-column: 1 / -1;
    width: 100%;
    max-width: 400px;
    align-self: start;
  }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  input, textarea { font-size: 11px; padding: 6px; }
  .btn-primary, .btn-cancelar { padding: 8px 12px; font-size: 11px; }
}

/* ========================================================================
   ESTILOS PARA LA GESTIÓN DE PERMISOS
   ======================================================================== */

/* CONTENEDOR PRINCIPAL DE PERMISOS */
.permiso-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* SECCIÓN DE SELECCIÓN DE USUARIO */
.permiso-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permiso-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--txt-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.permiso-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--borde);
  background: var(--bg-input);
  font-size: 13px;
  color: var(--txt-normal);
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.permiso-input:focus {
  border-color: var(--azul);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
}

/* LISTA DE PERMISOS */
.permiso-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permiso-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--bg-input);
  border-radius: 10px;
  border: 1px solid var(--borde);
  transition: all 0.2s ease;
}

.permiso-item:hover {
  background: var(--bg-card);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.permiso-item.permiso-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* INFORMACIÓN DEL PERMISO */
.permiso-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0; /* Para que funcione correctamente en flex */
}

.permiso-icono {
  font-size: 20px;
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.permiso-nombre {
  font-size: 14px;
  font-weight: 600;
  color: var(--txt-titulo);
  margin-bottom: 2px;
}

.permiso-descripcion {
  font-size: 12px;
  color: var(--txt-suave);
  line-height: 1.4;
}

/* TOGGLE SWITCH PERSONALIZADO */
.permiso-toggle {
  position: relative;
  width: 50px;
  height: 26px;
}

.permiso-toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.permiso-toggle label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--toggle-off);
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.permiso-toggle label::after {
  position: absolute;
  content: "";
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: var(--thumb);
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.permiso-toggle input[type="checkbox"]:checked + label {
  background: var(--toggle-on);
}

.permiso-toggle input[type="checkbox"]:checked + label::after {
  transform: translateX(24px);
}

/* BOTÓN DE GUARDAR PERMISOS */
.btn-permisos {
  width: 100%;
  max-width: 300px;
  padding: 12px 20px;
  background: var(--azul-dark);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.btn-permisos:hover:not(:disabled) {
  background: #163d5e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 77, 123, 0.2);
}

.btn-permisos:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* MENSAJES DE OPERACIÓN */
.mensaje-operacion {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mensaje-operacion.exito {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.mensaje-operacion.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.mensaje-error-email {
  font-size: 11px;
  color: #dc2626;
  margin-top: -10px;
  font-weight: 600;
}

/* ICONOS EN LOS MENSAJES */
.mensaje-operacion::before {
  font-size: 16px;
}

.mensaje-operacion.exito::before {
  content: "✅";
}

.mensaje-operacion.error::before {
  content: "❌";
}

/* BOTÓN DE CANCELAR PERMISOS */
.btn-cancelar-permisos {
  background: transparent;
  color: var(--txt-suave);
  border: 1.5px solid var(--borde);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  width: 100%;
  max-width: 300px;
}

.btn-cancelar-permisos:hover {
  color: var(--txt-titulo);
  border-color: var(--txt-normal);
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .permiso-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .permiso-toggle {
    align-self: flex-start;
    margin-top: 8px;
  }

  .btn-permisos {
    width: 100%;
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .permiso-label {
    font-size: 11px;
  }

  .permiso-select {
    padding: 8px 10px;
    font-size: 12px;
  }

  .permiso-item {
    padding: 12px;
  }

  .permiso-nombre {
    font-size: 13px;
  }

  .permiso-descripcion {
    font-size: 11px;
  }

  .permiso-toggle {
    width: 45px;
    height: 24px;
  }

  .permiso-toggle label::after {
    width: 20px;
    height: 20px;
    top: 2px;
    left: 2px;
  }

  .permiso-toggle input[type="checkbox"]:checked + label::after {
    transform: translateX(21px);
  }

  .btn-permisos {
    padding: 12px;
    font-size: 12px;
  }
}

/* ── TOAST ── */
.toast-msg {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 9999;
  white-space: nowrap;
  pointer-events: none;
}

.toast-msg.exito {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.toast-msg.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>