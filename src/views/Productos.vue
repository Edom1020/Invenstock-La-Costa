<template>
  <div class="layout">

    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN -->
    <div class="main">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="search-wrap">
          <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar productos, SKU o categorías..."
          />
        </div>
        <div class="topbar-right">
          <button class="notif-btn">
            <img src="/images/images-movimientos/notif.png" style="width:18px;height:18px;object-fit:contain;" />
            <span class="notif-dot"></span>
          </button>
          <div class="avatar-btn" @click="triggerFileInput" title="Cambiar foto de perfil">
            <img v-if="profilePhoto" :src="profilePhoto" class="avatar-img" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <input ref="fileInput" type="file" accept="image/*"
            style="display:none" @change="handlePhotoChange" />
        </div>
      </header>

      <!-- CONTENT -->
      <div class="content">

        <!-- ENCABEZADO -->
        <div class="page-header">
          <div>
            <h1>Catálogo de Inventario</h1>
            <p>Gestiona y monitorea el stock de tus productos de electrónica, hogar y comida.</p>
          </div>
          <button class="btn-nuevo" @click="$router.push('/productos/nuevo')">
            + Nuevo Producto
          </button>
        </div>

        <!-- STATS -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">VALOR TOTAL INVENTARIO</div>
            <div class="stat-value">$1,240,500</div>
            <div class="stat-growth">↑ +12.5% este mes</div>
          </div>
          <div class="stat-card center">
            <div class="stat-icon-wrap">
              <img src="/images/images-dashboard/warningtriangular.png" style="width:28px;height:28px;object-fit:contain;" />
            </div>
            <div class="stat-value">24</div>
            <div class="stat-sub">Stock bajo</div>
          </div>
          <div class="stat-card dark">
            <div class="stat-label">Categoría Popular</div>
            <div class="stat-value-dark">Electrónica</div>
            <span class="badge-popular">420 ítems</span>
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
              v-for="cat in categorias"
              :key="cat.key"
              :class="['pill', categoriaActiva === cat.key ? 'active' : '']"
              @click="categoriaActiva = cat.key"
            >
              {{ cat.nombre }}
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
              <tr v-for="prod in productosFiltrados" :key="prod.id">
                <td>
                  <div class="img-placeholder">
                    <img :src="getCatIcon(prod.categoria)" style="width:22px;height:22px;object-fit:contain;opacity:0.5;" />
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
                <td class="price">${{ prod.precio.toFixed(2) }}</td>
                <td>
                  <div class="actions">
                    <button class="btn-edit" title="Editar">✏️</button>
                    <button class="btn-del" title="Eliminar" @click="eliminar(prod.id)">🗑️</button>
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
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { ref, computed } from 'vue'





const profilePhoto = ref(null)
const fileInput = ref(null)
const userInitials = 'JD'
const busqueda = ref('')
const categoriaActiva = ref('todas')
const paginaActual = ref(1)
const porPagina = 10

const triggerFileInput = () => fileInput.value.click()
const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (file) profilePhoto.value = URL.createObjectURL(file)
}

const categorias = [
  { key: 'electronica', nombre: 'Electrónica' },
  { key: 'hogar',       nombre: 'Hogar'       },
  { key: 'comida',      nombre: 'Comida'      },
]

const getCatNombre = (key) =>
  categorias.find(c => c.key === key)?.nombre || key

const getCatIcon = (categoria) => {
  const icons = {
    electronica: '/images/images-dashboard/macbookicon.png',
    hogar:       '/images/images-dashboard/sofaicon.png',
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

const eliminar = (id) => {
  // Cuando conectes el backend: await fetch(`/api/productos/${id}`, { method: 'DELETE' })
  productos.value = productos.value.filter(p => p.id !== id)
}

const productos = ref([
  { id: 1, nombre: 'Tablet Pro 12.9"',        descripcion: 'Apple Inc. - Silver Edition',    sku: 'TAB-2024-001', categoria: 'electronica', stock: 45,  stockMax: 50,  precio: 1299.00 },
  { id: 2, nombre: 'Escritorio Nórdico',       descripcion: 'Madera Maciza de Roble',         sku: 'FUR-WAL-120',  categoria: 'hogar',       stock: 3,   stockMax: 20,  precio: 450.00  },
  { id: 3, nombre: 'Caja de Manzanas x40',     descripcion: 'Manzana Red Delicious',          sku: 'COM-APL-040',  categoria: 'comida',      stock: 120, stockMax: 200, precio: 85.00   },
  { id: 4, nombre: 'Headphones Studio X',      descripcion: 'Bluetooth 5.3 High Fidelity',   sku: 'AUD-WRL-505',  categoria: 'electronica', stock: 12,  stockMax: 100, precio: 299.00  },
  { id: 5, nombre: 'Silla Ergonómica',         descripcion: 'Soporte Lumbar Ajustable',       sku: 'FUR-CHR-210',  categoria: 'hogar',       stock: 8,   stockMax: 30,  precio: 380.00  },
  { id: 6, nombre: 'MacBook Pro M3',           descripcion: 'Apple - Space Gray 14"',         sku: 'LAP-APL-003',  categoria: 'electronica', stock: 5,   stockMax: 20,  precio: 2499.00 },
  { id: 7, nombre: 'Caja de Arroz 25kg',       descripcion: 'Arroz Diana Premium',            sku: 'COM-RIC-025',  categoria: 'comida',      stock: 60,  stockMax: 100, precio: 45.00   },
])

const productosFiltrados = computed(() => {
  let lista = productos.value
  if (categoriaActiva.value !== 'todas')
    lista = lista.filter(p => p.categoria === categoriaActiva.value)
  if (busqueda.value.trim())
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.value.toLowerCase())
    )
  return lista
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(productosFiltrados.value.length / porPagina))
)
</script>

<style>
/* ── HEADER ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}
.page-header h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
.page-header p  { font-size: 13px; color: #64748b; margin-top: 4px; }

.btn-nuevo {
  background: #1e4d7b;
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
}
.btn-nuevo:hover { background: #185a96; }

/* ── STATS ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}
.stat-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px 22px;
  border: 1px solid #e5e7eb;
}
.stat-card.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.stat-card.dark { background: #1e4d7b; }
.stat-label   { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
.stat-card.dark .stat-label { color: #93c5fd; }
.stat-value   { font-size: 30px; font-weight: 700; color: #0f172a; }
.stat-value-dark { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 10px; }
.stat-growth  { font-size: 12px; color: #16a34a; margin-top: 4px; font-weight: 600; }
.stat-sub     { font-size: 12px; color: #64748b; margin-top: 4px; }
.stat-icon-wrap {
  width: 50px; height: 50px; border-radius: 50%;
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
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #475569;
  font-weight: 500;
  transition: all 0.15s;
}
.pill:hover     { border-color: #38BDF8; color: #0369a1; }
.pill.active    { border-color: #38BDF8; background: #e0f2fe; color: #0369a1; font-weight: 600; }
.filter-icon   { color: #0369a1; border-color: #38BDF8; background: #f0f9ff; }
.showing       { font-size: 12px; color: #94a3b8; }

/* ── TABLA ── */
.table-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
thead tr { border-bottom: 1px solid #f1f5f9; }
thead th {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 14px 16px; text-align: left;
}
tbody tr { border-bottom: 1px solid #f8fafc; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #fafbfc; }
tbody td { padding: 14px 16px; font-size: 13.5px; color: #334155; vertical-align: middle; }

.img-placeholder {
  width: 44px; height: 44px; border-radius: 8px;
  background: #f1f5f9; border: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
}
.prod-name  { font-weight: 600; color: #0f172a; font-size: 13.5px; }
.prod-sub   { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.sku-cell   { font-size: 12px; color: #94a3b8; }

.badge-cat { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.badge-cat.electronica { background: #e0f2fe; color: #0369a1; }
.badge-cat.hogar       { background: #fef3c7; color: #92400e; }
.badge-cat.comida      { background: #dcfce7; color: #15803d; }

.stock-wrap { display: flex; flex-direction: column; gap: 4px; }
.stock-nums { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.stock-actual { font-weight: 600; color: #0f172a; }
.stock-max    { color: #94a3b8; }
.stock-pct    { font-size: 11px; font-weight: 700; }
.stock-pct.high { color: #16a34a; }
.stock-pct.med  { color: #f59e0b; }
.stock-pct.low  { color: #ef4444; }
.progress-bar { height: 5px; border-radius: 10px; background: #f1f5f9; width: 80px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }
.progress-fill.high { background: #22c55e; }
.progress-fill.med  { background: #f59e0b; }
.progress-fill.low  { background: #ef4444; }

.price { font-weight: 600; color: #0f172a; }
.actions { display: flex; gap: 8px; align-items: center; }
.btn-edit, .btn-del {
  width: 30px; height: 30px; border-radius: 6px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 13px;
}
.btn-edit { border: 1px solid #e5e7eb; background: #ffffff; }
.btn-edit:hover { background: #e0f2fe; border-color: #38BDF8; }
.btn-del  { border: 1px solid #fee2e2; background: #ffffff; }
.btn-del:hover  { background: #fee2e2; }

/* ── PAGINACIÓN ── */
.pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-top: 1px solid #f1f5f9;
}
.pag-btn {
  padding: 6px 14px; border-radius: 6px;
  border: 1px solid #e5e7eb; background: #ffffff;
  font-size: 13px; cursor: pointer; color: #475569;
}
.pag-btn:hover:not(:disabled) { background: #f1f5f9; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-numbers { display: flex; gap: 4px; }
.pag-num {
  width: 32px; height: 32px; border-radius: 6px;
  border: 1px solid #e5e7eb; background: #ffffff;
  font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #475569;
}
.pag-num.active { background: #1e4d7b; color: #ffffff; border-color: #1e4d7b; }
.pag-num:hover:not(.active) { background: #f1f5f9; }
</style>
