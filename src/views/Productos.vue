<template>
  <div class="layout" :class="{ 'dark-mode': temaStore.temaActual === 'oscuro' }">

    <!-- SIDEBAR -->
    <Sidebar :tema="temaStore.temaActual" />

    <!-- MAIN -->
    <div class="main">

      <Topbar @buscar="busqueda = $event" />

      <!-- CONTENT -->
      <div class="content">

        <!-- ENCABEZADO -->
        <div class="page-header">
          <div>
            <h1>Catálogo de Inventario</h1>
            <p>Gestiona y monitorea el stock de tus productos de electrónica, hogar y comida.</p>
          </div>
          <!-- El botón de nuevo producto solo lo ven los administradores -->
          <button v-if="puede('crear_producto')" class="btn-nuevo" @click="irARegistrar">
            + Nuevo Producto
          </button>
        </div>

        <!-- STATS -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">VALOR TOTAL INVENTARIO</div>
            <div class="stat-value">COP {{ totalInventarioValor.toLocaleString('es-CO') }}</div>
            <div :class="['stat-growth', porcentajeCrecimiento >= 0 ? 'positive' : 'negative']">
              {{ porcentajeCrecimiento >= 0 ? '↑ +' : '↓ ' }}{{ Math.abs(porcentajeCrecimiento).toFixed(1) }}% este mes
            </div>
          </div>
          <div class="stat-card center">
            <div class="stat-icon-wrap">
              <img src="/images/images-dashboard/warningtriangular.png" style="width:28px;height:28px;object-fit:contain;" :style="{ filter: temaStore.temaActual === 'oscuro' ? 'invert(1)' : 'none' }" />
            </div>
            <div class="stat-value">{{ stockBajoCount }}</div>
            <div class="stat-sub">Stock bajo</div>
          </div>
          <div class="stat-card dark">
            <div class="stat-label">Categoría Popular</div>
            <div class="stat-value-dark">{{ categoriaPopular.nombre }}</div>
            <span class="badge-popular">{{ categoriaPopular.count }} ítems</span>
          </div>
        </div>

        <!-- FILTROS -->
        <div class="filters-row">
          <div class="filter-pills">
            <div
              :class="['pill', 'filter-icon', categoriaActiva === 'todas' ? 'active' : '']"
              @click="categoriaActiva = 'todas'"
            >
              ▼ Categoría: Todas
            </div>
            <div
              v-for="cat in productosStore.categorias"
              :key="cat"
              :class="['pill', categoriaActiva === cat ? 'active' : '']"
              @click="categoriaActiva = cat"
            >
              {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
            </div>
          </div>
          <span class="showing">
            Mostrando 1-{{ productosFiltrados.length }} de {{ productos.length }} productos
          </span>
        </div>

        <!-- TABLA -->
        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th style="width:60px;">IMAGEN</th>
                <th style="width:200px;">PRODUCTO</th>
                <th style="width:110px;">SKU</th>
                <th style="width:110px;">CATEGORÍA</th>
                <th style="width:150px;">STOCK</th>
                <th style="width:100px;">PRECIO</th>
                <th style="width:80px;">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in productosPaginados" :key="prod.id">
                <td>
                  <div class="prod-img-container">
                    <img v-if="prod.imagen" :src="prod.imagen" class="prod-img-thumb" />
                    <img v-else src="/images/images-dashboard/cajadecuadrotproductos.png" class="prod-img-placeholder" />
                  </div>
                </td>
                <td>
                  <div class="prod-name">{{ prod.nombre }}</div>
                  <div class="prod-sub">{{ prod.descripcion }}</div>
                </td>
                <td class="sku-cell">{{ prod.sku }}</td>
                <td>
                  <span :class="['badge-cat', prod.categoria]">
                    {{ getCatNombre(prod.categoria) }}
                  </span>
                </td>
                <td>
                  <div class="stock-wrap">
                    <div class="stock-nums">
                      <span class="stock-actual">{{ prod.stock }}</span>
                      <span class="stock-max">/{{ prod.stockMax }}</span>
                      <span :class="['stock-pct', getStockNivel(prod.stock, prod.stockMax)]">
                        {{ Math.round((prod.stock / prod.stockMax) * 100) }}%
                      </span>
                    </div>
                    <div class="progress-bar">
                      <div
                        :class="['progress-fill', getStockNivel(prod.stock, prod.stockMax)]"
                        :style="{ width: Math.round((prod.stock / prod.stockMax) * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="price">COP {{ prod.precio.toLocaleString('es-CO') }}</td>
                <td>
                  <div class="actions">
                    <button v-if="puede('editar_producto')" class="btn-edit" title="Editar" @click="abrirEditar(prod)">
                      <img src="/images/images-dashboard/editicon.png" style="width:20px;height:20px;object-fit:contain;" />
                    </button>
                    <button v-if="puede('eliminar_producto')" class="btn-del" title="Eliminar" @click="confirmarEliminar(prod)">
                      <img src="/images/images-dashboard/delicon.png" style="width:20px;height:20px;object-fit:contain;" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- PAGINACIÓN -->
          <div class="pagination">
            <button class="pag-btn" :disabled="paginaActual === 1" @click="paginaActual--">
              ← Anterior
            </button>
            <div class="pag-numbers">
              <div
                v-for="n in totalPaginas"
                :key="n"
                :class="['pag-num', paginaActual === n ? 'active' : '']"
                @click="paginaActual = n"
              >
                {{ n }}
              </div>
            </div>
            <button class="pag-btn" :disabled="paginaActual === totalPaginas" @click="paginaActual++">
              Siguiente →
            </button>
          </div>
        </div>

      </div>
    </div>  
    <!-- ── MODAL EDITAR ── -->
     <Teleport to="body">
       <div v-if="modalEditarVisible" class="modal-overlay" @click.self="cancelarEdicion">
         <div class="modal-box">
           <div class="modal-header">
             <h2 class="modal-title">Editar Producto</h2>
             <button class="modal-close" @click="cancelarEdicion">✕</button>
           </div>
     
           <div v-if="productoEditando" class="modal-body">
             <div class="form-grid">
     
               <div class="form-group full" style="display: flex; justify-content: center; margin-bottom: 10px;">
                 <div class="prod-img-container" style="width: 80px; height: 80px; border-radius: 12px;">
                    <img v-if="productoEditando.imagen" :src="productoEditando.imagen" class="prod-img-thumb" />
                    <img v-else src="/images/images-dashboard/cajadecuadrotproductos.png" class="prod-img-placeholder" style="width: 32px; height: 32px;" />
                 </div>
               </div>

               <div class="form-group full">
                 <label class="form-label">Nombre del producto</label>
                 <input v-model="productoEditando.nombre" class="form-input" type="text" />
               </div>
     
               <div class="form-group full">
                 <label class="form-label">Descripción</label>
                 <input v-model="productoEditando.descripcion" class="form-input" type="text" />
               </div>
     
               <div class="form-group">
                 <label class="form-label">SKU</label>
                 <input v-model="productoEditando.sku" class="form-input" type="text" />
               </div>
     
               <div class="form-group">
                 <label class="form-label">Categoría</label>
                 <select v-model="productoEditando.categoria" class="form-input form-select">
                   <option v-for="cat in productosStore.categorias" :key="cat" :value="cat">
                     {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                   </option>
                 </select>
               </div>
     
               <div class="form-group">
                 <label class="form-label">Stock actual</label>
                 <input v-model.number="productoEditando.stock" class="form-input" type="number" min="0" />
               </div>
     
               <div class="form-group">
                 <label class="form-label">Stock máximo</label>
                 <input v-model.number="productoEditando.stockMax" class="form-input" type="number" min="1" />
               </div>
     
               <div class="form-group">
                 <label class="form-label">Precio (COP)</label>
                 <input v-model.number="productoEditando.precio" class="form-input" type="number" min="0" step="50" />
               </div>
     
               <!-- Preview barra de stock en tiempo real -->
               <div class="form-group full">
                 <label class="form-label">Vista previa del stock</label>
                 <div class="stock-preview">
                   <div class="stock-nums">
                     <span class="stock-actual">{{ productoEditando.stock }}</span>
                     <span class="stock-max">/{{ productoEditando.stockMax }}</span>
                     <span :class="['stock-pct', getStockNivel(productoEditando.stock, productoEditando.stockMax)]">
                       {{ Math.round((productoEditando.stock / productoEditando.stockMax) * 100) }}%
                     </span>
                   </div>
                   <div class="progress-bar" style="width: 100%; margin-top: 6px;">
                     <div
                       :class="['progress-fill', getStockNivel(productoEditando.stock, productoEditando.stockMax)]"
                       :style="{ width: Math.min(100, Math.round((productoEditando.stock / productoEditando.stockMax) * 100)) + '%' }"
                     ></div>
                   </div>
                 </div>
               </div>
     
             </div>
           </div>
     
           <div class="modal-footer">
             <button class="btn-cancelar" @click="cancelarEdicion">Cancelar</button>
             <button class="btn-guardar" @click="guardarEdicion">Guardar cambios</button>
           </div>
         </div>
       </div>
     </Teleport>
     
     <!-- ── MODAL CONFIRMAR ELIMINAR ── -->
     <Teleport to="body">
       <div v-if="modalEliminarVisible" class="modal-overlay" @click.self="cancelarEliminar">
         <div class="modal-box modal-box--sm">
           <div class="modal-header">
             <h2 class="modal-title">Eliminar producto</h2>
             <button class="modal-close" @click="cancelarEliminar">✕</button>
           </div>
     
           <div class="modal-body">
             <div class="del-icon-wrap">
               <img src="/images/images-dashboard/delicon.png" style="width:32px;height:32px;object-fit:contain;opacity:0.7;" />
             </div>
             <p class="del-mensaje">
               ¿Estás seguro de que deseas eliminar
               <strong>{{ productoAEliminar?.nombre }}</strong>?
               Esta acción no se puede deshacer.
             </p>
           </div>
     
           <div class="modal-footer">
             <button class="btn-cancelar" @click="cancelarEliminar">Cancelar</button>
             <button class="btn-eliminar" @click="eliminar">Sí, eliminar</button>
           </div>
         </div>
       </div>
     </Teleport>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { ref, computed, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productos' // Importar store
import { useConfiguracionStore } from '../stores/configuracion'

import Topbar from "../components/Topbar.vue";
//Script para notificaciones//
const notificacionesRef = inject('notificacionesGlobal')

import { useTemaStore } from '../stores/tema'
const temaStore = useTemaStore()

const productosStore = useProductosStore()
const configuracionStore = useConfiguracionStore()
const router = useRouter()

const irARegistrar = () => {
  router.push('/registrar-producto')
}

// Para mostrar la foto de perfil en el topbar y configuración, usamos el store de usuario //
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()


const busqueda = ref('')
const categoriaActiva = ref('todas')
const paginaActual = ref(1)
const porPagina = 10

const getCatNombre = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1)

const getCatIcon = (categoria) => {
  const icons = {
    electronica: '/images/images-dashboard/macbookicon.png',
    hogar:       '/images/images-dashboard/sofagrande.png',
    comida:      '/images/images-dashboard/manzanaicon.png',
  }
  return icons[categoria] || '/images/images-dashboard/macbookicon.png'
}

const getStockNivel = (stock, max) => {
  const pct = (stock / max) * 100
  if (pct >= 50) return 'high'
  if (pct >= 20) return 'med'
  return 'low'
}

// ── MODAL EDITAR ──
const modalEditarVisible = ref(false)
const productoEditando = ref(null)


const abrirEditar = (prod) => {
  productoEditando.value = { ...prod } // copia para no mutar directo
  modalEditarVisible.value = true
}


const guardarEdicion = () => {
  productosStore.editarProducto(productoEditando.value)
  modalEditarVisible.value = false
}

const cancelarEdicion = () => {
  modalEditarVisible.value = false
  productoEditando.value = null
}

// ── MODAL ELIMINAR ──
const modalEliminarVisible = ref(false)
const productoAEliminar = ref(null)

const confirmarEliminar = (prod) => {
  productoAEliminar.value = prod
  modalEliminarVisible.value = true
}

const eliminar = () => {
  productosStore.eliminarProducto(productoAEliminar.value.id)
  // Cuando tengas backend: await fetch(`/api/productos/${productoAEliminar.value.id}`, { method: 'DELETE' })
  modalEliminarVisible.value = false
  productoAEliminar.value = null
}

const puede = (permiso) => {
  if (usuarioStore.rol === 'administrador') return true
  const permisos = usuarioStore.permisos || []
  return permisos.includes(permiso)
}

const cancelarEliminar = () => {
  modalEliminarVisible.value = false
  productoAEliminar.value = null
}


// Usar la lista del store directamente
const productos = computed(() => productosStore.productos)

// Calcular el valor total del inventario dinámicamente
const totalInventarioValor = computed(() => {
  return productosStore.productos.reduce((acc, p) => acc + (p.precio * p.stock), 0)
})

// Simulación de valor del mes anterior para calcular el crecimiento real
const valorMesAnterior = 5000000
const porcentajeCrecimiento = computed(() => {
  if (valorMesAnterior === 0) return 0
  return ((totalInventarioValor.value - valorMesAnterior) / valorMesAnterior) * 100
})

// KPI: Conteo total de productos en el catálogo
const totalProductosCount = computed(() => productos.value.length)

// KPI: Conteo de productos con stock bajo (Sincronizado con Configuración)
const stockBajoCount = computed(() => {
  const umbral = configuracionStore.inventario.stockMinimoGlobal
  return productos.value.filter(p => p.stock <= umbral).length
})

// KPI: Categoría más popular (con más ítems en stock)
const categoriaPopular = computed(() => {
  const categoriaCounts = productos.value.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + p.stock
    return acc
  }, {})

  let popularCat = { nombre: 'N/A', count: 0 }
  for (const cat in categoriaCounts) {
    if (categoriaCounts[cat] > popularCat.count) {
      popularCat = { nombre: cat.charAt(0).toUpperCase() + cat.slice(1), count: categoriaCounts[cat] }
    }
  }
  return popularCat
})

const productosFiltrados = computed(() => {
  let lista = productosStore.productos
  if (categoriaActiva.value !== 'todas')
    lista = lista.filter(p => p.categoria === categoriaActiva.value)
  if (busqueda.value.trim())
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.value.toLowerCase())
    )
  return lista
})

// ── PRODUCTOS PAGINADOS (Rebanada de la lista filtrada) ──
const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  const fin = inicio + porPagina
  return productosFiltrados.value.slice(inicio, fin)
})

// Resetear a la página 1 cuando cambian los filtros
watch([busqueda, categoriaActiva], () => {
  paginaActual.value = 1
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(productosFiltrados.value.length / porPagina))
)
</script>

<style scoped>
/* ── VARIABLES TEMA CLARO ── */
.layout {
  --bg-pag:        #f0f2f5;
  --bg-card:       #ffffff;
  --bg-input:      #f1f5f9;
  --borde:         #e5e7eb;
  --borde-suave:   #f8fafc;
  --txt-titulo:    #0f172a;
  --txt-normal:    #334155;
  --txt-suave:     #64748b;
  --txt-muted:     #94a3b8;
  --azul:          #38BDF8;
  --azul-dark:     #1e4d7b;
  --azul-hover:    #185a96;
  --azul-claro:    #e0f2fe;
  --azul-txt:      #0369a1;
  --verde-growth:  #16a34a;
  --cat-elec-bg:   #e0f2fe;
  --cat-elec-txt:  #0369a1;
  --cat-hogar-bg:  #fef3c7;
  --cat-hogar-txt: #92400e;
  --cat-comida-bg: #dcfce7;
  --cat-comida-txt:#15803d;
  --stock-high:    #16a34a;
  --stock-med:     #f59e0b;
  --stock-low:     #ef4444;
  --progress-bg:   #f1f5f9;
  --btn-hover-bg:  #fafbfc;
  --pag-active-bg: #1e4d7b;
  --edit-hover:    #e0f2fe;
  --del-bg:        #fee2e2;
}

/* ── VARIABLES TEMA OSCURO ── */
.layout.dark-mode {
  --bg-pag:        #0f172a;
  --bg-card:       #1e293b;
  --bg-input:      #334155;
  --borde:         #475569;
  --borde-suave:   #1e293b;
  --txt-titulo:    #f1f5f9;
  --txt-normal:    #cbd5e1;
  --txt-suave:     #94a3b8;
  --txt-muted:     #64748b;
  --azul:          #38BDF8;
  --azul-dark:     #378ADD;
  --azul-hover:    #2563eb;
  --azul-claro:    #1e3a5f;
  --azul-txt:      #7dd3fc;
  --verde-growth:  #86efac;
  --cat-elec-bg:   #1e3a5f;
  --cat-elec-txt:  #7dd3fc;
  --cat-hogar-bg:  #3d2e0a;
  --cat-hogar-txt: #fcd34d;
  --cat-comida-bg: #0f2e1a;
  --cat-comida-txt:#86efac;
  --stock-high:    #86efac;
  --stock-med:     #fcd34d;
  --stock-low:     #f87171;
  --progress-bg:   #334155;
  --btn-hover-bg:  #334155;
  --pag-active-bg: #378ADD;
  --edit-hover:    #1e3a5f;
  --del-bg:        #450a0a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.layout {
  display: flex;
  height: 100vh;
  background: var(--bg-pag);
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── TOPBAR ── */
.topbar {
  background: var(--bg-card);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.search-icon { width: 15px; height: 15px; object-fit: contain; }
.search-wrap input::placeholder { color: var(--txt-muted); }
.topbar-right { display: flex; align-items: center; gap: 14px; }

.notif-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-input);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: background 0.3s;
}

.notif-dot {
  width: 8px; height: 8px;
  background: #ef4444;
  border-radius: 50%;
  position: absolute; top: 6px; right: 6px;
  border: 1.5px solid var(--bg-card);
}

.avatar-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--azul);
  border: 2px solid #38bdf8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* ── CONTENT ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-pag);
  transition: background 0.3s;
}

/* ── PAGE HEADER ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.page-header p {
  font-size: 13px;
  color: var(--txt-suave);
  margin-top: 4px;
  transition: color 0.3s;
}

.btn-nuevo {
  background: var(--azul-dark);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.btn-nuevo:hover { background: var(--azul-hover); }

/* ── STATS ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 20px 22px;
  border: 1px solid var(--borde);
  transition: background 0.3s, border-color 0.3s;
}

.stat-card.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat-card.dark { background: var(--azul-dark); }

.stat-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--txt-suave);
  text-transform: uppercase;
  margin-bottom: 6px;
  transition: color 0.3s;
}

.stat-card.dark .stat-label { color: #93c5fd; }

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.stat-value-dark {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
}

.stat-growth {
  font-size: 12px;
  color: var(--verde-growth);
  margin-top: 4px;
  font-weight: 600;
  transition: color 0.3s;
}

.stat-growth.negative {
  color: var(--stock-low);
}

.stat-growth.positive {
  color: var(--verde-growth);
}

.stat-sub {
  font-size: 12px;
  color: var(--txt-suave);
  margin-top: 4px;
  transition: color 0.3s;
}

.stat-icon-wrap {
  width: 50px; height: 50px;
  border-radius: 50%;
  background: rgba(56,189,248,0.12);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px;
}

.badge-popular {
  background: rgba(56,189,248,0.2);
  color: #7dd3fc;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

/* ── FILTROS ── */
.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-pills { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.pill {
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  border: 1.5px solid var(--borde);
  background: var(--bg-card);
  color: var(--txt-normal);
  font-weight: 500;
  transition: all 0.15s;
}

.pill:hover     { border-color: var(--azul); color: var(--azul-txt); }
.pill.active    { border-color: var(--azul); background: var(--azul-claro); color: var(--azul-txt); font-weight: 600; }
.filter-icon    { color: var(--azul-txt); border-color: var(--azul); background: var(--azul-claro); }
.showing        { font-size: 12px; color: var(--txt-muted); transition: color 0.3s; }

/* ── TABLA ── */
.table-card {
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid var(--borde);
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s;
}

table { width: 100%; border-collapse: collapse; table-layout: fixed; }

thead tr { border-bottom: 1px solid var(--borde); }

thead th {
  font-size: 11px; font-weight: 700;
  color: var(--txt-muted);
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 14px 16px; text-align: left;
  transition: color 0.3s;
}

tbody tr { border-bottom: 1px solid var(--borde-suave); }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--btn-hover-bg); }

tbody td {
  padding: 14px 16px;
  font-size: 13.5px;
  color: var(--txt-normal);
  vertical-align: middle;
  transition: color 0.3s;
}

.prod-img-container {
  width: 44px; height: 44px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1px solid var(--borde);
  display: flex; 
  align-items: center; 
  justify-content: center;
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s;
}

.prod-img-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-img-placeholder {
  width: 22px;
  height: 22px;
  object-fit: contain;
  opacity: 0.4;
}

.prod-name {
  font-weight: 600;
  color: var(--txt-titulo);
  font-size: 13.5px;
  transition: color 0.3s;
}

.prod-sub {
  font-size: 11px;
  color: var(--txt-muted);
  margin-top: 2px;
  transition: color 0.3s;
}

.sku-cell {
  font-size: 12px;
  color: var(--txt-muted);
  transition: color 0.3s;
}

.badge-cat { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; transition: background 0.3s, color 0.3s; }
.badge-cat.electronica { background: var(--cat-elec-bg);   color: var(--cat-elec-txt);   }
.badge-cat.hogar       { background: var(--cat-hogar-bg);  color: var(--cat-hogar-txt);  }
.badge-cat.comida      { background: var(--cat-comida-bg); color: var(--cat-comida-txt); }

.stock-wrap { display: flex; flex-direction: column; gap: 4px; }
.stock-nums { display: flex; align-items: center; gap: 6px; font-size: 12px; }

.stock-actual { font-weight: 600; color: var(--txt-titulo); transition: color 0.3s; }
.stock-max    { color: var(--txt-muted); transition: color 0.3s; }

.stock-pct    { font-size: 11px; font-weight: 700; }
.stock-pct.high { color: var(--stock-high); }
.stock-pct.med  { color: var(--stock-med);  }
.stock-pct.low  { color: var(--stock-low);  }

.progress-bar {
  height: 5px; border-radius: 10px;
  background: var(--progress-bg);
  width: 80px; overflow: hidden;
  transition: background 0.3s;
}

.progress-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }
.progress-fill.high { background: var(--stock-high); }
.progress-fill.med  { background: var(--stock-med);  }
.progress-fill.low  { background: var(--stock-low);  }

.price {
  font-weight: 600;
  color: var(--txt-titulo);
  transition: color 0.3s;
}

.actions { display: flex; gap: 8px; align-items: center; }

.btn-edit, .btn-del {
  width: 30px; height: 30px; border-radius: 6px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: background 0.2s, border-color 0.2s;
}

.btn-edit { border: 1px solid var(--borde); background: var(--bg-card); }
.btn-edit:hover { background: var(--edit-hover); border-color: var(--azul); }

.btn-del  { border: 1px solid var(--del-bg); background: var(--bg-card); }
.btn-del:hover  { background: var(--del-bg); }

/* ── PAGINACIÓN ── */
.pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--borde);
  transition: border-color 0.3s;
}

.pag-btn {
  padding: 6px 14px; border-radius: 6px;
  border: 1px solid var(--borde);
  background: var(--bg-card);
  font-size: 13px; cursor: pointer;
  color: var(--txt-normal);
  transition: background 0.2s, border-color 0.2s;
}

.pag-btn:hover:not(:disabled) { background: var(--bg-input); }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.pag-numbers { display: flex; gap: 4px; }

.pag-num {
  width: 32px; height: 32px; border-radius: 6px;
  border: 1px solid var(--borde);
  background: var(--bg-card);
  font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--txt-normal);
  transition: background 0.2s, color 0.2s;
}

.pag-num.active { background: var(--pag-active-bg); color: #ffffff; border-color: var(--pag-active-bg); }
.pag-num:hover:not(.active) { background: var(--bg-input); }

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .content { padding: 16px; }
  .tabla { font-size: 12px; }
  thead th { font-size: 10px; }
  tbody td { font-size: 12px; padding: 12px 8px; }
  .btn-edit, .btn-del { width: 28px; height: 28px; font-size: 12px; }
  .pagination { padding: 12px 16px; }
  .pag-btn { padding: 5px 12px; font-size: 12px; }
  .pag-num { width: 28px; height: 28px; font-size: 12px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .layout { overflow-x: hidden; }
  .content { padding: 12px; }
  .page-title { font-size: 18px; }
  .page-header { flex-direction: column; gap: 12px; align-items: stretch; }
  .btn-nuevo { width: 100%; }
  .stats-row { grid-template-columns: 1fr; }
  .table-card { overflow-x: auto; }
  table { min-width: 700px; }
  .tabla { font-size: 11px; }
  thead th { font-size: 9px; padding: 0 0 8px 0; }
  tbody td { font-size: 10px; padding: 10px 6px; }
  .actions { gap: 4px; }
  .btn-edit, .btn-del { width: 26px; height: 26px; font-size: 11px; }
  .pagination { padding: 10px 12px; flex-wrap: wrap; }
  .pag-btn { padding: 4px 10px; font-size: 11px; }
  .pag-num { width: 26px; height: 26px; font-size: 11px; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .content { padding: 10px; }
  .page-title { font-size: 16px; }
  thead th { font-size: 8px; }
  tbody td { font-size: 9px; padding: 8px 4px; }
  .btn-edit, .btn-del { width: 24px; height: 24px; font-size: 10px; }
  .pag-num { width: 24px; height: 24px; font-size: 10px; }
}
</style>