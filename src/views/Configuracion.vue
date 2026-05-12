<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual" />

    <!-- ÁREA PRINCIPAL -->
    <div class="main">

      <!-- Barra superior -->
      <header class="topbar">
        <div class="topbar-right">
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

            <button class="conf-btn-edit" @click="modoEdicion = !modoEdicion">
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
                  <input type="number" v-model.number="inventario.stockMinimo" class="conf-stock-input" min="0" />
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
          
              <div class="conf-password-form">
                <input
                  v-model="password.actual"
                  type="password"
                  placeholder="Contraseña actual"
                  class="conf-input-password"
                />
                <input
                  v-model="password.nueva"
                  type="password"
                  placeholder="Nueva contraseña"
                  class="conf-input-password"
                />
                <input
                  v-model="password.confirmar"
                  type="password"
                  placeholder="Confirmar contraseña"
                  class="conf-input-password"
                />
              </div>
          
              <div style="display:flex; gap:10px;">
                <button class="conf-btn-update" @click="cambiarContraseña">
                  Actualizar Contraseña
                </button>
                <button class="conf-btn-cancelar-pass" @click="mostrarPassword = false">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
                    
        </div>


        <!-- Botones de acción -->
        <div class="action-buttons">
          <button class="btn-cancelar" @click="cancelar">Cancelar</button>
          <button class="btn-primary" @click="guardarCambios">Guardar Cambios</button>
        </div>

      </div>
    </div>
  </div>

  

</template>


<script setup>
import { ref, reactive, inject } from 'vue'
import Sidebar from '../components/Sidebar.vue'

// Para mostrar la foto de perfil en el topbar y configuración, usamos el store de usuario //
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

//Script para notificaciones//
const notificacionesRef = inject('notificacionesGlobal')

// Función para cambiar la foto de perfil, actualiza el store de usuario //
const cambiarFoto = (e) => {
  const file = e.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    usuarioStore.cambiarFotoPerfil(url)  
  }
}

const modoEdicion = ref(false)

const perfil = reactive({
  nombre:    'Ricardo Alcaraz',
  correo:    'r.alcaraz@invenstock.com',
  cargo:     'Administrador de Inventario',
  ubicacion: 'Sede La Costa'
})

const inventario = reactive({ stockMinimo: 15, unidadMedida: 'u' })

import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const notif = reactive({ email: true, escritorio: false, reportes: true })

const password = reactive({ actual: '', nueva: '', confirmar: '' })

const cambiarContraseña = () => {
  if (!password.actual || !password.nueva || !password.confirmar) {
    alert('Por favor completa todos los campos.')
    return
  }
  if (password.nueva !== password.confirmar) {
    alert('Las contraseñas no coinciden.')
    return
  }
  if (password.nueva.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.')
    return
  }
  alert('¡Contraseña actualizada exitosamente!')
  password.actual = ''
  password.nueva = ''
  password.confirmar = ''
}

const abrirCambioContraseña = () => {
  alert('Cambio de contraseña próximamente.')
}

//Mostrar contraseña en formulario de seguridad
const mostrarPassword = ref(false)

const cancelar = () => {
  perfil.nombre    = 'Ricardo Alcaraz'
  perfil.correo    = 'r.alcaraz@invenstock.com'
  perfil.cargo     = 'Administrador de Inventario'
  perfil.ubicacion = 'Sede La Costa'
  inventario.stockMinimo  = 15
  inventario.unidadMedida = 'u'
  modoEdicion.value = false
}

const guardarCambios = () => {
  modoEdicion.value = false
  alert('¡Configuración guardada!')
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

/* ── TOPBAR ── */
.topbar {
  background: var(--bg-topbar);
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid var(--borde);
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.topbar-right { display: flex; align-items: center; gap: 12px; }

.notif-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-input); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: background 0.3s;
}
.notif-dot {
  width: 7px; height: 7px; background: #ef4444; border-radius: 50%;
  position: absolute; top: 5px; right: 5px;
  border: 1.5px solid var(--bg-topbar);
}
.avatar-btn {
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
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
}

/* ── CARDS ── */
.config-card {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;

  display: flex;
  flex-direction: column;
  gap : 14px;
}

.config-card.full {
  grid-column: span 2;
  width: 100%;
  max-width: 400px;
  margin-left: auto;
  height: fit-content;
  min-height: auto;
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

/* ── APARIENCIA ── */
.config-card-appearance {
  background: var(--bg-card);
  border-radius: 48px;
  padding: 18px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
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
.config-card.full {
  width: 298.67px;
  margin-left: auto;
}

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
  .content { padding: 12px; }
  .page-title { font-size: 18px; }
  .conf-container { grid-template-columns: 1fr; }
  .conf-field { margin-bottom: 10px; }
  input, textarea { font-size: 12px; padding: 8px; width: 100%; }
  .conf-label { font-size: 11px; }
  .btn-primary, .btn-cancelar { padding: 10px 16px; font-size: 12px; width: 100%; }
  .action-buttons { gap: 10px; }
  .conf-btn-update { width: 100%; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  input, textarea { font-size: 11px; padding: 6px; }
  .btn-primary, .btn-cancelar { padding: 8px 12px; font-size: 11px; }
}
</style>