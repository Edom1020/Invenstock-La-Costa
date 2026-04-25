<template>
  <div class="layout">
 
    <!-- SIDEBAR -->
    <Sidebar />
 
    <!-- ÁREA PRINCIPAL -->
    <div class="main">
 
      <!-- Barra superior -->
      <header class="topbar">
        <div class="search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
          <input type="text" placeholder="Buscar movimientos..." />
        </div>
        <div class="topbar-right">
          <button class="notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:16px;height:16px;object-fit:contain;" />
            <span class="notif-dot"></span>
          </button>
          <div class="avatar-btn">
            <img src="/images/Usericon.png" class="avatar-img" />
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
                Inventario y Costos
              </div>
 
              <div class="three-col">
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
              </div>
            </div>
 
          </div>
 
          <!-- ══ COLUMNA DERECHA ══ -->
          <div class="rp-right">
 
            <!-- Imagen del Producto -->
            <div class="card-imagen">
              <div class="card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
 
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
  stockMinimo:  5
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
/* ════════════════════════════════════════
   VARIABLES (heredadas del layout global)
   ════════════════════════════════════════ */
.layout {
  --bg-pag:    #f0f2f5;
  --bg-card:   #ffffff;
  --bg-input:  #f1f5f9;
  --borde:     #e5e7eb;
  --txt:       #0f172a;
  --txt2:      #334155;
  --txt3:      #64748b;
  --txt4:      #94a3b8;
  --azul:      #38bdf8;
  --azul-dark: #1e4e78;
}
 
* { box-sizing: border-box; margin: 0; padding: 0; }
 
/* ── LAYOUT ── */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
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
  background: #fff;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--borde);
  flex-shrink: 0;
}
 
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-input); border-radius: 20px;
  padding: 7px 16px; width: 280px;
}
.search-icon { width: 14px; height: 14px; object-fit: contain; }
.search-wrap input {
  border: none; background: transparent; outline: none;
  font-size: 13px; color: var(--txt2); width: 100%;
}
.search-wrap input::placeholder { color: var(--txt4); }
 
.topbar-right { display: flex; align-items: center; gap: 10px; }
 
.notif-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-input); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.notif-dot {
  width: 7px; height: 7px; background: #ef4444; border-radius: 50%;
  position: absolute; top: 5px; right: 5px;
  border: 1.5px solid #fff;
}
.avatar-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: #0ea5e9; border: 2px solid #38bdf8;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
 
/* ── CONTENT ── */
.content {
  display: flex;
  overflow-y: auto;
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
 /* ── CABECERA DE PÁGINA ──
   El max-width debe coincidir con el de .rp-grid para mantener la alineación */  
.page-header {
  width: 100%;
  max-width: 1400px; /* Debe ser el mismo max-width que usaste en .rp-grid */
  text-align: left;  /* Alinea el texto a la izquierda */
  margin: 0 auto 25px auto; /* El 'auto' a los lados lo centra como bloque, pero el texto adentro va a la izquierda */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea los elementos internos (título/subtítulo) a la izquierda */
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--txt);
  margin-bottom: 4px; /* Espacio pequeño entre título y subtítulo */
}
.page-subtitle {
  font-size: 13px;
  color: var(--txt3);
  max-width: 600px; /* Evita que el subtítulo se estire demasiado en pantallas anchas */
}


 
/* ── GRID PRINCIPAL ──
   align-items: start evita que las columnas se estiren
*/
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
.card-info{
  background: #fff;
  border: 1px solid var(--borde);
  border-radius: 24px; /* Un poco menos que los 48px de configuración para que se vea más técnico */
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: background 0.3s, border-color 0.3s;
  min-height: 300px;
  width: 100%;
}

.card-inventario {
  background: #fff;
  border: 1px solid var(--borde);
  border-radius: 24px; 
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: background 0.3s, border-color 0.3s;
  width: 100%;
  min-height: 300px;
}

.card-imagen {
  background: #fff;
  border: 1px solid var(--borde);
  border-radius: 24px; 
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 18px 20px;
  border: 1px solid var(--borde);
}

 
.card-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
  color: var(--txt); margin-bottom: 18px;
}
.card-title svg { color: var(--txt3); flex-shrink: 0; }
 
/* ── CAMPOS ── */
.field-group { display: flex; flex-direction: column; }
 
.field-label {
  font-size: 10px; font-weight: 700; color: var(--txt4);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 6px;
}
 
.field-input {
  width: 100%; padding: 10px 14px;
  border-radius: 9px; border: 1.5px solid var(--borde);
  background: var(--bg-input); color: var(--txt2);
  font-size: 13px; font-family: inherit; outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.field-input:focus { border-color: var(--azul); background: #fff; }
.field-input::placeholder { color: var(--txt4); }
 
.field-sku {
  font-weight: 700; color: var(--azul-dark);
}
 
.field-textarea {
  resize: none; height: 82px; line-height: 1.5;
}
 
.field-stock-min {
  color: #ef4444 !important;
  font-weight: 700;
  border-color: #fecaca !important;
  background: #fff5f5 !important;
}
.field-stock-min:focus { border-color: #f87171 !important; }
 
/* ── GRIDS DE CAMPOS ── */
.two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
 
/* ── SELECT ── */
.select-wrap { position: relative; }
.custom-select {
  width: 100%; padding: 10px 32px 10px 14px;
  border-radius: 9px; border: 1.5px solid var(--borde);
  background: var(--bg-input); color: var(--txt2);
  font-size: 13px; font-family: inherit; outline: none;
  appearance: none; cursor: pointer;
  transition: border-color 0.2s;
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
  background: #f8fafc; border-radius: 10px;
  border: 1px solid var(--borde);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px; overflow: hidden;
}
.img-preview-img { width: 100%; height: 100%; object-fit: contain; }
.img-placeholder  { display: flex; align-items: center; justify-content: center; }
 
.upload-area {
  border: 2px dashed var(--borde);
  border-radius: 10px; padding: 18px;
  display: flex; flex-direction: column;
  align-items: center; gap: 5px;
  cursor: pointer; transition: border-color 0.2s;
  color: var(--txt3);
}
.upload-area:hover { border-color: var(--azul); }
.upload-label {
  font-size: 13px; font-weight: 600; color: var(--txt2);
}
.upload-hint {
  font-size: 10px; font-weight: 700;
  color: var(--txt4); letter-spacing: 0.4px;
}
 
/* ── GUÍA ── */
.guia-card {
  background: #f0f6ff; border: 1px solid #bfdbfe;
  border-radius: 14px; padding: 16px 18px;
}
.guia-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700;
  color: var(--azul-dark); letter-spacing: 0.5px;
  margin-bottom: 14px;
}
.guia-item {
  display: flex; gap: 10px;
  margin-bottom: 10px;
}
.guia-item:last-child { margin-bottom: 0; }
.guia-num {
  font-size: 11px; font-weight: 700;
  color: #93c5fd; flex-shrink: 0; margin-top: 1px;
}
.guia-texto {
  font-size: 12px; color: #334155; line-height: 1.5;
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