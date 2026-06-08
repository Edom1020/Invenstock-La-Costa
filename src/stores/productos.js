import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import api from '../views/api'
import { useNotificacionesStore } from './notificaciones'
import { useConfiguracionStore } from './configuracion'
import { reproducirSonido } from '../services/notificaciones.service'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref([])
  const lotes = ref([])
  const historialMovimientos = ref([])
  const cargando = ref(false)


const categorias = ref([]) // { _id, nombre }

const cargarCategorias = async () => {
  try {
    const res = await api.get('/categorias')
    console.log('📦 Respuesta categorías:', res.data)
    categorias.value = res.data.data || res.data || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}


  // ── Lógica de Sonidos según el stock ──
  const dispararSonidoStock = (prod) => {
    if (!prod) return
    if (prod.stock <= 5) {
      console.log(`🚨 Disparando sonido muy_critico para ${prod.nombre}`)
      reproducirSonido('muy_critico')
    } else if (prod.stock <= 15) {
      console.log(`⚠️ Disparando sonido critico para ${prod.nombre}`)
      reproducirSonido('critico')
    } else if (prod.stock <= 30) {
      console.log(`🔔 Disparando sonido normal para ${prod.nombre}`)
      reproducirSonido('normal')
    }
  }

  // ── Verificación de Estado (Notificación + Sonido) ──
  const verificarEstadoStock = (prod) => {
    if (!prod) return

    const configStore = useConfiguracionStore()
    const notificacionesStore = useNotificacionesStore()

    // Notificación visual si es menor al mínimo global configurado
    if (prod.stock <= configStore.inventario.stockMinimoGlobal) {
      notificacionesStore.agregarNotificacion(
        'Alerta de Stock Bajo',
        `El producto "${prod.nombre}" ha alcanzado el nivel de alerta (${prod.stock} unidades).`,
        'alerta'
      )
    }

    dispararSonidoStock(prod)
  }

  //  CARGAR PRODUCTOS DESDE BACKEND
const cargarProductos = async () => {
  try {
    cargando.value = true
    const res = await api.get('/productos?limit=100')
    productos.value = (res.data.data || []).map(p => ({
      ...p,
      id: p._id || p.id,           // garantizar que id siempre existe
      categoriaId: p.categoria?._id || p.categoria,
      categoria: typeof p.categoria === 'object'
        ? (p.categoria?.nombre || 'sin-categoria')
        : (p.categoria || 'sin-categoria'),
      stockMax: p.stockMax || p.movimientoMaximo || 0
    }))
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    cargando.value = false
  }
}

  //  CARGAR LOTES DESDE BACKEND
const cargarLotes = async () => {
  try {
    const res = await api.get('/productos/lotes')
    const raw = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.lotes || [])

    lotes.value = raw.map(l => {
      // El backend embebe el lote como subdocumento en l.lote
      const sub = l.lote && typeof l.lote === 'object' ? l.lote : null

      const fechaEntrada     = (sub?.fechaEntrada     || l.fechaEntrada     || '').split('T')[0] || ''
      // El endpoint de edición actualiza l.fechaVencimiento (raíz), no el subdocumento
      const fechaVencimiento = (l.fechaVencimiento || sub?.fechaVencimiento || '').split('T')[0] || ''
      const stock            = l.stock ?? l.cantidad ?? 0

      let estado = 'activo'
      if (stock === 0) {
        estado = 'agotado'
      } else if (fechaVencimiento) {
        const diasAlerta = sub?.diasAlerta ?? 30
        const hoy = new Date()
        const vence = new Date(fechaVencimiento)
        const diffDias = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24))
        if (diffDias <= diasAlerta) estado = 'por-vencer'
      }

      return {
        ...l,
        _id:             l._id || l.id,
        id:              l._id || l.id,
        productoId:      l._id || l.id,
        numero:          l.numero || sub?.codigo || l.codigo || '',
        producto:        l.producto || '',
        sku:             l.sku || '',
        cantidad:        stock,
        fechaEntrada,
        usaVencimiento:  sub ? !!sub.usaVencimiento : !!fechaVencimiento,
        fechaVencimiento,
        observaciones:   l.observaciones || sub?.observacion || '',
        estado
      }
    })
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Sin permisos para ver lotes — solo administradores')
    } else {
      console.error('Error al cargar lotes:', error)
    }
  }
}

  //  CARGAR MOVIMIENTOS DESDE BACKEND
const cargarMovimientos = async () => {
  try {
    const res = await api.get('/movimientos')
    const data = res.data.data || res.data || []
    historialMovimientos.value = data.map(m => {
      let productoNombre = '', categoriaVal = ''

      if (m.producto && typeof m.producto === 'object') {
        productoNombre = m.producto.nombre || ''
        // m.producto.categoria es un ObjectId crudo — cruzar con productos ya cargados
        const prodRef = productos.value.find(p => String(p._id || p.id) === String(m.producto._id))
        categoriaVal = prodRef?.categoria || ''
      } else {
        const pid = m.productoId || m.producto || ''
        const prod = pid ? productos.value.find(p => String(p._id || p.id) === String(pid)) : null
        productoNombre = prod?.nombre || ''
        categoriaVal = prod?.categoria || ''
      }

      let fechaFormato = '-'
      const fechaRaw = m.fecha || m.createdAt || ''
      if (fechaRaw) {
        const dt = new Date(fechaRaw)
        if (!isNaN(dt.getTime())) fechaFormato = dt.toLocaleDateString('es-ES')
      }

      return { ...m, producto: productoNombre, categoria: categoriaVal, fechaFormato }
    })
    .sort((a, b) => (String(b._id || '') > String(a._id || '') ? 1 : -1))
  } catch (error) {
    console.error('Error al cargar movimientos:', error)
  }
}

  //  AGREGAR PRODUCTO
  const agregarProducto = async (nuevoProducto) => {
    try {
      const res = await api.post('/productos', nuevoProducto)
      await cargarProductos()
      return { success: true, data: res.data.data }
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al crear producto'
      return { success: false, error: mensaje }
    }
  }

  //  EDITAR PRODUCTO
const editarProducto = async (productoEditado) => {
  try {
    const payload = {
      nombre:           productoEditado.nombre,
      descripcion:      productoEditado.descripcion,
      sku:              productoEditado.sku,
      marca:            productoEditado.marca,
      categoria:        productoEditado.categoriaId,
      precio:           productoEditado.precio,
      stock:            productoEditado.stock,
      stockMinimo:      productoEditado.stockMinimo,
      movimientoMaximo: productoEditado.stockMax || productoEditado.movimientoMaximo,
      usaLotes:         productoEditado.usaLotes,
    }
    console.log('📤 Payload limpio:', payload)
    await api.put(`/productos/${productoEditado._id || productoEditado.id}`, payload)
    await cargarProductos()
    const prod = productos.value.find(p => p._id === productoEditado._id || p.id === productoEditado.id)
    verificarEstadoStock(prod)
    return { success: true }
  } catch (error) {
    console.error('❌ Error respuesta backend:', JSON.stringify(error.response?.data, null, 2))
    return { success: false, error: 'Error al editar producto' }
  }
}

  //  ELIMINAR PRODUCTO
  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/productos/${id}`)
      await cargarProductos()
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error al eliminar producto' }
    }
  }

  //  AGREGAR LOTE
  const agregarLote = async (nuevoLote) => {
    try {
      await api.post('/productos/lotes', {
        productoId:      nuevoLote.productoId,
        lote:            nuevoLote.numero,
        sku:             nuevoLote.sku,
        stock:           nuevoLote.cantidad,
        fechaVencimiento: nuevoLote.usaVencimiento ? nuevoLote.fechaVencimiento : null,
        observacionLote: nuevoLote.observaciones
      })
      await cargarLotes()
      await cargarProductos()
      return { success: true }
    } catch (error) {
      console.error('Error al agregar lote:', error)
      return { success: false, error: error.response?.data?.message || 'Error al agregar lote' }
    }
  }

  //  ELIMINAR LOTE
  const eliminarLote = async (id) => {
    try {
      await api.delete(`/productos/lotes/${id}`)
      await cargarLotes()
      await cargarProductos()
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error al eliminar lote' }
    }
  }

  //  EDITAR LOTE
  const editarLote = async (loteEditado) => {
    try {
      // lote.codigo viene del objeto lote anidado (loteEditado.lote.codigo)
      // o del campo numero si se editó en el modal
      const codigoLote = loteEditado.numero 
        || loteEditado.lote?.codigo 
        || loteEditado.lote 
        || ''

      await api.put(`/productos/lotes/${loteEditado.id || loteEditado._id}`, {
        lote: codigoLote,
        sku: loteEditado.sku,
        stock: loteEditado.cantidad,
        fechaVencimiento: loteEditado.usaVencimiento ? loteEditado.fechaVencimiento : null,
        observacionLote: loteEditado.observaciones
      })
      await cargarLotes()
      await cargarProductos()

      // Check stock for the product associated with the edited lot
      const prod = productos.value.find(p => p.id === loteEditado.productoId || p._id === loteEditado.productoId)
      verificarEstadoStock(prod)

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error al editar lote' }
    }
  }

  //  REGISTRAR MOVIMIENTO
  const registrarMovimiento = async (mov) => {
    try {
      await api.post('/movimientos', {
        producto: mov.productoId,   // el backend valida body('producto'), no 'productoId'
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        fecha: mov.fecha,
        notas: mov.notas
      })
      await cargarProductos()
      await cargarMovimientos()

      // Trigger  para sonidos y  notificationes
      const prod = productos.value.find(p => p.id === mov.productoId || p._id === mov.productoId)
      verificarEstadoStock(prod)

      return { success: true }
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al registrar movimiento'
      return { success: false, error: mensaje }
    }
  }

  const agregarCategoria = (nuevaCat) => {
    const catSaneada = nuevaCat.toLowerCase().trim()
    if (catSaneada && !categorias.value.includes(catSaneada)) {
      categorias.value.push(catSaneada)
    }
  }

  // Sincronización proactiva: Si se cambia el umbral global en Configuración.vue
  watch(() => useConfiguracionStore().inventario.stockMinimoGlobal, (nuevoUmbral) => {
    const notificacionesStore = useNotificacionesStore()
    productos.value.forEach(prod => {
      if (prod.stock <= nuevoUmbral) {
        notificacionesStore.agregarNotificacion(
          'Ajuste de Alerta Global',
          `"${prod.nombre}" clasifica como stock bajo con el nuevo umbral de ${nuevoUmbral} unidades.`,
          'alerta'
        )
        dispararSonidoStock(prod)
      }
    })
  })

  return {
    productos,
    lotes,
    historialMovimientos,
    categorias,
    cargando,
    cargarProductos,
    cargarCategorias,
    cargarLotes,
    cargarMovimientos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    agregarLote,
    editarLote,
    eliminarLote,
    registrarMovimiento,
    agregarCategoria
  }
})