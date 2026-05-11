<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">
 
    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual"/>
 
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
          <h1 class="page-title">Registrar Producto</h1>
          <p class="page-subtitle">Complete la información técnica y logística del nuevo ítem para el catálogo.</p>
        </div>
 
        <div class="rp-grid">
 
          <!-- ══ COLUMNA IZQUIERDA ══ -->
          <div class="rp-left">
 
            <!-- Información General -->
            <div class="card-info">
              <div class="card-title">
                <img src="/images/images-registroproducto/infoicon.png" style="width:16px;height:16px;object-fit:contain;" />
                Información General
              </div>
 
              <!-- Nombre -->
              <div class="field-group" style="margin-bottom:14px;">
                <label class="field-label">Nombre del Producto</label>
                <input
                  v-model="producto.nombre"
                  class="field-input"
                  type="text"
                  placeholder="Ej: Taladro Percutor Industrial 500W"
                />
              </div>
 
              <!-- SKU + Categoría -->
              <div class="two-col" style="margin-bottom:14px;">
                <div class="field-group">
                  <label class="field-label">SKU / Código</label>
                  <input
                    v-model="producto.sku"
                    class="field-input field-sku"
                    type="text"
                    placeholder="INV-00923"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">Categoría</label>
                  <div class="select-wrap">
                    <select v-model="producto.categoria" class="custom-select">
                      <option value="">Seleccionar categoría...</option>
                      <option value="herramientas">Herramientas</option>
                      <option value="electricidad">Electricidad</option>
                      <option value="plomeria">Plomería</option>
                      <option value="ferreteria">Ferretería</option>
                      <option value="otro">Otro</option>
                    </select>
                    <span class="select-arrow">▾</span>
                  </div>
                </div>
              </div>
 
              <!-- Descripción -->
              <div class="field-group">
                <label class="field-label">Descripción Detallada</label>
                <textarea
                  v-model="producto.descripcion"
                  class="field-input field-textarea"
                  placeholder="Describa las especificaciones técnicas, materiales y uso recomendado..."
                ></textarea>
              </div>
            </div>
 
            <!-- Inventario y Costos -->
            <div class="card-inventario">
              <div class="card-title">
                <img src="/images/images-registroproducto/costosicon.png" style="width:16px;height:16px;object-fit:contain;" />
                Inventario y Costos
              </div>
 
              <div class="four-col">
                <div class="field-group">
                  <label class="field-label">Stock Inicial</label>
                  <input
                    v-model.number="producto.stockInicial"
                    class="field-input"
                    type="number"
                    min="0"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">Precio Unitario ($)</label>
                  <input
                    v-model.number="producto.precio"
                    class="field-input"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">Stock Mínimo</label>
                  <input
                    v-model.number="producto.stockMinimo"
                    class="field-input field-stock-min"
                    type="number"
                    min="0"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label">Stock Máximo</label>
                  <input v-model.number="producto.stockMaximo" class="field-input field-stock-max" type="number" min="0" />
                </div>
              </div>
            </div>
 
          </div>
 
          <!-- ══ COLUMNA DERECHA ══ -->
          <div class="rp-right">
 
            <!-- Imagen del Producto -->
            <div class="card-imagen">
              <div class="card-title">
                <img src="/images/images-registroproducto/imgicon.png" style="width:16px;height:16px;object-fit:contain;" />
                Imagen del Producto
              </div>
 
              <!-- Preview -->
              <div class="img-preview">
                <img v-if="imagenPreview" :src="imagenPreview" class="img-preview-img" />
                <div v-else class="img-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>
 
              <!-- Upload -->
              <div class="upload-area" @click="$refs.imgInput.click()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                <span class="upload-label">Subir Imagen</span>
                <span class="upload-hint">PNG, JPG HASTA 5MB</span>
              </div>
              <input
                ref="imgInput"
                type="file"
                accept="image/*"
                style="display:none"
                @change="cargarImagen"
              />
            </div>
 
            <!-- Guía de Registro -->
            <div class="guia-card">
              <div class="guia-title">
                <img src="/images/images-registroproducto/guiaicon.png" style="width:14px;height:14px;object-fit:contain;" />
                GUÍA DE REGISTRO
              </div>
              <div class="guia-item">
                <span class="guia-num">01</span>
                <span class="guia-texto">Use nombres descriptivos claros para facilitar la búsqueda en bodega.</span>
              </div>
              <div class="guia-item">
                <span class="guia-num">02</span>
                <span class="guia-texto">El SKU es único. El sistema generará uno correlativo si se deja en blanco.</span>
              </div>
              <div class="guia-item">
                <span class="guia-num">03</span>
                <span class="guia-texto">Defina el stock mínimo para recibir alertas automáticas de reabastecimiento.</span>
              </div>
            </div>
 
            <!-- Acciones -->
            <button class="btn-guardar" @click="guardarProducto">Guardar Producto</button>
            <button class="btn-cancelar" @click="cancelar">Cancelar Registro</button>
 
          </div>
 
        </div>
      </div>
    </div>
  </div>
</template>
 
 
<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

//Script para notificaciones//
const notificacionesRef = inject('notificacionesGlobal')

import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

//DARK MODE o modo oscuro
import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()
 
const router = useRouter()
 
// ── Imagen ──
const imagenPreview = ref(null)
const cargarImagen = (e) => {
  const file = e.target.files[0]
  if (file) imagenPreview.value = URL.createObjectURL(file)
}
 
// ── Datos del producto ──
const producto = reactive({
  nombre:       '',
  sku:          'INV-00923',
  categoria:    '',
  descripcion:  '',
  stockInicial: 0,
  precio:       0.00,
  stockMinimo:  5,
  stockMaximo: 50
})
 
// ── Guardar ──
const guardarProducto = () => {
  if (!producto.nombre.trim()) {
    alert('El nombre del producto es obligatorio.')
    return
  }
  // Aquí iría la llamada a tu API / store
  alert(`Producto "${producto.nombre}" guardado correctamente.`)
  router.push('/productos')
}
 
// ── Cancelar ──
const cancelar = () => {
  router.push('/productos')
}
</script>
 
 
<style scoped>
/* ── VARIABLES TEMA CLARO ── */
.layout {
  --bg-pag:        #f0f2f5;
  --bg-card:       #ffffff;
  --bg-input:      #f1f5f9;
  --borde:         #e5e7eb;
  --txt:           #0f172a;
  --txt2:          #334155;
  --txt3:          #64748b;
  --txt4:          #94a3b8;
  --azul:          #38bdf8;
  --azul-dark:     #1e4e78;
  --guia-bg:       #f0f6ff;
  --guia-borde:    #bfdbfe;
  --guia-titulo:   #1e4e78;
  --guia-num:      #93c5fd;
  --guia-txt:      #334155;
  --stock-min-bg:  #fff5f5;
  --stock-min-borde: #fecaca;
  --stock-min-txt: #ef4444;
  --preview-bg:    #f8fafc;
}

/* ── VARIABLES TEMA OSCURO ── */
.layout.dark-mode {
  --bg-pag:        #0f172a;
  --bg-card:       #1e293b;
  --bg-input:      #334155;
  --borde:         #475569;
  --txt:           #f1f5f9;
  --txt2:          #cbd5e1;
  --txt3:          #94a3b8;
  --txt4:          #64748b;
  --azul:          #38bdf8;
  --azul-dark:     #378ADD;
  --guia-bg:       #1e3a5f;
  --guia-borde:    #1e4d7b;
  --guia-titulo:   #7dd3fc;
  --guia-num:      #38bdf8;
  --guia-txt:      #cbd5e1;
  --stock-min-bg:  #450a0a;
  --stock-min-borde: #7f1d1d;
  --stock-min-txt: #f87171;
  --preview-bg:    #334155;
  --stock-max-bg:     #1e3a5f;
  --stock-max-borde:  #1e4d7b;
  --stock-max-txt:    #7dd3fc;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── LAYOUT ── */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ── TOPBAR ── */
.topbar {
  background: var(--bg-card);
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid var(--borde);
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.topbar-right { display: flex; align-items: center; gap: 10px; }

.notif-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-input); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: background 0.3s;
}
.notif-dot {
  width: 7px; height: 7px; background: #ef4444; border-radius: 50%;
  position: absolute; top: 5px; right: 5px;
  border: 1.5px solid var(--bg-card);
}
.avatar-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: #0ea5e9; border: 2px solid #38bdf8;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* ── CONTENT ── */
.content {
  overflow-y: auto;
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  background: var(--bg-pag);
  transition: background 0.3s;
}

.page-header {
  width: 100%;
  max-width: 1400px;
  text-align: left;
  margin: 0 auto 25px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--txt);
  margin-bottom: 4px;
  transition: color 0.3s;
}
.page-subtitle {
  font-size: 13px;
  color: var(--txt3);
  max-width: 600px;
  transition: color 0.3s;
}

/* ── GRID PRINCIPAL ── */
.rp-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}
.rp-left,
.rp-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── CARDS ── */
.card-info,
.card-inventario,
.card-imagen {
  background: var(--bg-card);
  border: 1px solid var(--borde);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: background 0.3s, border-color 0.3s;
  width: 100%;
}

.card-info      { min-height: 300px; }
.card-inventario { min-height: 300px; }

.card-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
  color: var(--txt); margin-bottom: 18px;
  transition: color 0.3s;
}
.card-title svg { color: var(--txt3); flex-shrink: 0; }

/* ── CAMPOS ── */
.field-group { display: flex; flex-direction: column; }

.field-label {
  font-size: 10px; font-weight: 700; color: var(--txt4);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 6px; transition: color 0.3s;
}

.field-input {
  width: 100%; padding: 10px 14px;
  border-radius: 9px; border: 1.5px solid var(--borde);
  background: var(--bg-input); color: var(--txt2);
  font-size: 13px; font-family: inherit; outline: none;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}
.field-input:focus { border-color: var(--azul); background: var(--bg-card); }
.field-input::placeholder { color: var(--txt4); }

.field-sku { font-weight: 700; color: var(--azul-dark); }

.field-textarea { resize: none; height: 82px; line-height: 1.5; }

.field-stock-min {
  color: var(--stock-min-txt);
  font-weight: 700;
  border-color: var(--stock-min-borde);
  background: var(--stock-min-bg);
}
.field-stock-min:focus { border-color: var(--stock-min-txt); }


/* Agregado para Stock Máximo */
.field-stock-max{
  color: var(--stock-max-txt);
  font-weight: 700;
  border-color: var(--stock-max-borde);
  background: var(--stock-max-bg);
}

.field-stock-max:focus { border-color: var(--stock-max-txt); }
/* ── GRIDS DE CAMPOS ── */
.two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.four-col { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; }

/* ── SELECT ── */
.select-wrap { position: relative; }
.custom-select {
  width: 100%; padding: 10px 32px 10px 14px;
  border-radius: 9px; border: 1.5px solid var(--borde);
  background: var(--bg-input); color: var(--txt2);
  font-size: 13px; font-family: inherit; outline: none;
  appearance: none; cursor: pointer;
  transition: border-color 0.2s, background 0.3s, color 0.3s;
}
.custom-select:focus { border-color: var(--azul); }
.select-arrow {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--txt3); pointer-events: none; font-size: 13px;
}

/* ── IMAGEN ── */
.img-preview {
  width: 100%; height: 150px;
  background: var(--preview-bg); border-radius: 10px;
  border: 1px solid var(--borde);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px; overflow: hidden;
  transition: background 0.3s, border-color 0.3s;
}
.img-preview-img { width: 100%; height: 100%; object-fit: contain; }
.img-placeholder  { display: flex; align-items: center; justify-content: center; }

.upload-area {
  border: 2px dashed var(--borde);
  border-radius: 10px; padding: 18px;
  display: flex; flex-direction: column;
  align-items: center; gap: 5px;
  cursor: pointer; transition: border-color 0.2s, color 0.2s;
  color: var(--txt3);
}
.upload-area:hover { border-color: var(--azul); }
.upload-label { font-size: 13px; font-weight: 600; color: var(--txt2); transition: color 0.3s; }
.upload-hint {
  font-size: 10px; font-weight: 700;
  color: var(--txt4); letter-spacing: 0.4px; transition: color 0.3s;
}

/* ── GUÍA ── */
.guia-card {
  background: var(--guia-bg);
  border: 1px solid var(--guia-borde);
  border-radius: 14px; padding: 16px 18px;
  transition: background 0.3s, border-color 0.3s;
}
.guia-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700;
  color: var(--guia-titulo); letter-spacing: 0.5px;
  margin-bottom: 14px; transition: color 0.3s;
}
.guia-item {
  display: flex; gap: 10px;
  margin-bottom: 10px;
}
.guia-item:last-child { margin-bottom: 0; }
.guia-num {
  font-size: 11px; font-weight: 700;
  color: var(--guia-num); flex-shrink: 0; margin-top: 1px;
  transition: color 0.3s;
}
.guia-texto {
  font-size: 12px; color: var(--guia-txt);
  line-height: 1.5; transition: color 0.3s;
}

/* ── BOTONES ── */
.btn-guardar {
  width: 100%; background: var(--azul-dark); color: #fff;
  border: none; border-radius: 10px; padding: 14px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  margin-bottom: 10px; transition: background 0.2s;
}
.btn-guardar:hover { background: #163d5e; }

.btn-cancelar {
  width: 100%; background: transparent; color: var(--txt3);
  border: none; font-size: 13px; font-weight: 600;
  cursor: pointer; padding: 6px;
  transition: color 0.2s;
}
.btn-cancelar:hover { color: var(--txt); }
</style>