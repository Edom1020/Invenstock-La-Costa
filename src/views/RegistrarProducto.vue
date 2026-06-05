<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">
 
    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual"/>
 
    <!-- ÁREA PRINCIPAL -->
    <div class="main">
 
      <!-- TOPBAR-->
        <Topbar @buscar="busqueda = $event" />
 
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
 
              <!-- SKU + Categoría + Marca -->
              <div class="three-col" style="margin-bottom:14px;">
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
                       <option v-for="cat in productosStore.categorias" :key="cat._id" :value="cat._id">
                            {{ cat.nombre }}
                          </option>
                    </select>
                    <span class="select-arrow">▾</span>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Marca</label>
                  <input
                    v-model="producto.marca"
                    class="field-input"
                    type="text"
                    placeholder="Ej: Bosch, DeWalt"
                  />
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
                  <label class="field-label">Precio Unitario (COP)</label>
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
                  <input v-model.number="producto.stockMax" class="field-input field-stock-max" type="number" min="0" />
                </div>
              </div>
            </div>

            <!-- Control de Lotes y Vencimiento -->
            <div class="card-lotes">
              <div class="card-title">
                <img src="/images/images-registroproducto/costosicon.png" style="width:16px;height:16px;object-fit:contain;" />
                Control de Lotes y Vencimiento
              </div>

              <!-- Switch Usar Lotes -->
              <div class="lotes-switch-row">
                <div class="lotes-switch-info">
                  <div class="lotes-switch-titulo">Usar Lotes</div>
                  <div class="lotes-switch-desc">Habilita control de vencimiento y trazabilidad de lotes</div>
                </div>
                <button
                  class="modal-toggle"
                  :class="{ on: usaLotes }"
                  @click="usaLotes = !usaLotes"
                ></button>
              </div>

              <!-- Campos de Lote (solo si está activo) -->
              <transition name="lotes-fade">
                <div v-if="usaLotes" class="lotes-campos">

                  <div class="lotes-switch-row" style="margin-bottom: 14px; background: var(--bg-card); border: 1px solid var(--borde);">
                    <div class="lotes-switch-info">
                      <div class="lotes-switch-titulo">Habilitar Fecha de Vencimiento</div>
                      <div class="lotes-switch-desc">Activar si este lote tiene una fecha de expiración específica</div>
                    </div>
                    <button
                      class="modal-toggle"
                      :class="{ on: lote.usaVencimiento }"
                      @click="lote.usaVencimiento = !lote.usaVencimiento"
                    ></button>
                  </div>
                  
                  <!-- Código Lote + Fecha Vencimiento -->
                  <div class="two-col" style="margin-bottom:14px;">
                    <div class="field-group">
                      <label class="field-label">Código Lote</label>
                      <input
                        v-model="lote.codigo"
                        class="field-input"
                        type="text"
                        placeholder="Ej: A001, LOTE-2026-001"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Fecha Vencimiento</label>
                      <input
                        v-model="lote.fechaVencimiento"
                        class="field-input"
                        type="date"
                        :disabled="!lote.usaVencimiento"
                      />
                    </div>
                  </div>

                  <!-- Días Alerta + Observación -->
                  <div class="two-col" style="margin-bottom:14px;">
                    <div class="field-group">
                      <label class="field-label">Días Alerta (preventiva)</label>
                      <input
                        v-model.number="lote.diasAlerta"
                        class="field-input"
                        type="number"
                        min="1"
                        placeholder="Ej: 30"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Observación (opcional)</label>
                      <input
                        v-model="lote.observacion"
                        class="field-input"
                        type="text"
                        placeholder="Ej: Lote proveedor principal"
                      />
                    </div>
                  </div>

                  <!-- Info -->
                  <div class="lotes-info-box">
                    <span class="lotes-info-icon">ℹ️</span>
                    <span class="lotes-info-texto">
                      <strong>SKU:</strong> Identifica el producto general (Aceite Oliva)
                      <br/>
                      <strong>Código Lote:</strong> Identifica esta entrada específica (A001)
                    </span>
                  </div>

                </div>
              </transition>

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
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { useProductosStore } from '../stores/productos' // Importar store

import Topbar from "../components/Topbar.vue";

import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

//DARK MODE o modo oscuro
import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const productosStore = useProductosStore()
 
const router = useRouter()
 
// ── Imagen ──
const imagenPreview = ref(null)
const imagenBase64 = ref(null)

const comprimirImagen = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 300
        let w = img.width, h = img.height
        if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX }
        else if (h > MAX)     { w = Math.round(w * MAX / h); h = MAX }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

const cargarImagen = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen no puede superar los 5MB.')
    e.target.value = ''
    return
  }
  imagenPreview.value = URL.createObjectURL(file)
  imagenBase64.value = await comprimirImagen(file)
}
 
// ── Datos del producto ──
const producto = reactive({
  nombre:       '',
  sku:          'INV-00923',
  categoria:    '',
  descripcion:  '',
  marca:        '',
  stockInicial: 0,
  precio:       0.00,
  stockMinimo:  5,
  stockMax:     50
})

// ── Control de lotes ──
const usaLotes = ref(false)
const lote = reactive({
  codigo:              '',
  fechaEntrada:        new Date().toISOString().split('T')[0], // Añadir fecha de entrada por defecto
  fechaVencimiento:   '',
  usaVencimiento:     false,
  diasAlerta:         30,
  observacion:        ''
})
 
// ── Guardar ──
  const guardarProducto = async () => {
    // ── Validación básica ──
    if (!producto.nombre.trim()) {
      alert('El nombre del producto es obligatorio.')
      return
    }
  
    if (!producto.sku.trim()) {
      alert('El SKU es obligatorio.')
      return
    }
  
    if (!producto.categoria.trim()) {
      alert('Debes seleccionar una categoría.')
      return
    }
  
    // ── Validación de lote (si está activo) ──
    if (usaLotes.value) {
      if (!lote.codigo.trim()) {
        alert('El código de lote es obligatorio cuando usas lotes.')
        return
      }
  
      if (lote.usaVencimiento && !lote.fechaVencimiento) {
        alert('La fecha de vencimiento es obligatoria.')
        return
      }
  
      if (!lote.diasAlerta || lote.diasAlerta < 1) {
        alert('Los días de alerta deben ser al menos 1.')
        return
      }
    }
  
    // ── Construir objeto para enviar ──
    const datosProducto = {
      nombre:        producto.nombre,
      descripcion:   producto.descripcion,
      sku:           producto.sku,
      marca:         producto.marca,
      categoria:     producto.categoria,
      precio:        producto.precio,
      stock:         producto.stockInicial,
      stockMinimo:   producto.stockMinimo,
      stockMax:      producto.stockMax,
      usaLotes:      usaLotes.value,
      imagen:        imagenBase64.value || null
    }
  
    // ── Si usa lotes, agregar datos del lote ──
    if (usaLotes.value) {
      datosProducto.lote = {
        codigo:              lote.codigo,
        fechaEntrada:        lote.fechaEntrada,
        usaVencimiento:     lote.usaVencimiento,
        fechaVencimiento: lote.usaVencimiento ? lote.fechaVencimiento : null,
        diasAlerta:         lote.diasAlerta,
        observacion:        lote.observacion
      }
      
    }
  const resultado = await productosStore.agregarProducto(datosProducto)
  if (resultado.success) {
    alert(`✅ Producto "${producto.nombre}" guardado correctamente.`)
    router.push('/productos')
  } else {
    alert(`❌ Error al guardar: ${resultado.error}`)
  }
}
   
  // ── Cancelar ──
  const cancelar = () => {
    router.push('/productos')
  }

  onMounted(async () => {
  await productosStore.cargarCategorias()
})

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
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
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

/* ── CARD LOTES ── */
.card-lotes {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid var(--borde);
  margin-bottom: 16px;
}

/* Switch Usar Lotes */
.lotes-switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: var(--bg-input);
  border-radius: 10px;
  margin-bottom: 16px;
}

.lotes-switch-info {
  flex: 1;
}

.lotes-switch-titulo {
  font-size: 13px;
  font-weight: 700;
  color: var(--txt-titulo);
  margin-bottom: 2px;
}

.lotes-switch-desc {
  font-size: 11px;
  color: var(--txt-suave);
}

/* Toggle Switch */
.modal-toggle {
  width: 50px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;
  outline: none;
}

.modal-toggle::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: left 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-toggle.on {
  background: #38BDF8;
}

.modal-toggle.on::after {
  left: 24px;
}

/* Campos de Lote */
.lotes-campos {
  animation: lotes-slideDown 0.3s ease-out;
}

.lotes-fade-enter-active,
.lotes-fade-leave-active {
  transition: all 0.3s ease;
}

.lotes-fade-enter-from,
.lotes-fade-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

@keyframes lotes-slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

/* Info Box */
.lotes-info-box {
  display: flex;
  gap: 10px;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #0369a1;
  margin-top: 14px;
}

.lotes-info-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.lotes-info-texto {
  line-height: 1.5;
}

.dark-mode .lotes-info-box {
  background: #1e3a5f;
  border-color: #1e5a96;
  color: #7dd3fc;
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  /* Layout */
  .rp-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  /* Grid de campos */
  .three-col {
    grid-template-columns: 1fr 1fr;
  }

  .four-col {
    grid-template-columns: 1fr 1fr;
  }

  /* Página */
  .page-title {
    font-size: 26px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  /* Cards */
  .card-info,
  .card-inventario,
  .card-lotes,
  .card-imagen,
  .guia-card {
    padding: 16px;
  }

  /* Botones */
  .btn-guardar,
  .btn-cancelar {
    width: 100%;
    margin-bottom: 10px;
  }

  /* Imagen preview */
  .img-preview {
    height: 180px;
  }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  /* Layout principal */
  .layout {
    flex-direction: column;
  }

  .main {
    width: 100%;
  }

  /* Content padding */
  .content {
    padding: 16px 12px;
  }

  /* Page header */
  .page-header {
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 6px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  /* Grid de campos */
  .rp-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .three-col,
  .two-col,
  .four-col {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Cards */
  .card-info,
  .card-inventario,
  .card-lotes,
  .card-imagen,
  .guia-card {
    padding: 12px;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 13px;
    margin-bottom: 12px;
  }

  /* Labels y inputs */
  .field-label {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .field-input,
  .field-textarea {
    font-size: 13px;
    padding: 8px 10px;
    min-height: 36px;
  }

  .field-textarea {
    min-height: 80px;
  }

  /* Selects */
  .custom-select {
    font-size: 12px;
    padding: 8px 28px 8px 10px;
  }

  /* Imagen preview */
  .img-preview {
    height: 140px;
    margin-bottom: 12px;
  }

  .upload-label {
    font-size: 12px;
  }

  .upload-hint {
    font-size: 10px;
  }

  /* Switch Usar Lotes */
  .lotes-switch-row {
    padding: 12px;
    margin-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .lotes-switch-titulo {
    font-size: 12px;
  }

  .lotes-switch-desc {
    font-size: 10px;
  }

  .modal-toggle {
    width: 56px;
    height: 32px;
  }

  .modal-toggle::after {
    width: 28px;
    height: 28px;
  }

  .modal-toggle.on::after {
    left: 26px;
  }

  /* Campos de lote */
  .lotes-campos {
    padding: 0;
  }

  /* Info box */
  .lotes-info-box {
    font-size: 11px;
    padding: 10px;
    gap: 8px;
  }

  .lotes-info-icon {
    font-size: 14px;
  }

  /* Guía */
  .guia-item {
    padding: 10px;
    gap: 8px;
  }

  .guia-num {
    font-size: 12px;
    width: 24px;
    height: 24px;
  }

  .guia-texto {
    font-size: 11px;
  }

  /* Botones */
  .btn-guardar,
  .btn-cancelar {
    width: 100%;
    padding: 12px;
    margin-bottom: 8px;
    font-size: 13px;
  }

  /* Topbar */
  .topbar {
    padding: 12px 16px;
  }

  /* Avatar */
  .avatar-btn {
    width: 32px;
    height: 32px;
  }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  /* Content padding aún más pequeño */
  .content {
    padding: 12px 8px;
  }

  .page-title {
    font-size: 18px;
  }

  /* Cards aún más compactas */
  .card-info,
  .card-inventario,
  .card-lotes,
  .card-imagen,
  .guia-card {
    padding: 10px;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 12px;
  }

  .field-label {
    font-size: 10px;
  }

  .field-input,
  .field-textarea {
    font-size: 12px;
  }

  /* Botones más pequeños pero clickeables */
  .btn-guardar,
  .btn-cancelar {
    padding: 10px;
    font-size: 12px;
  }

  /* Switch más compacto */
  .modal-toggle {
    width: 48px;
    height: 28px;
  }

  .modal-toggle::after {
    width: 24px;
    height: 24px;
  }

  .modal-toggle.on::after {
    left: 22px;
  }
}
</style>