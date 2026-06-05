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

    // El backend puede guardar el nro de lote como:
    //   a) lote.lote = "A001"          (string plano)
    //   b) lote.lote = { codigo: "A001", fechaEntrada: "...", ... }  (subdocumento)
    lotes.value = raw.map(l => {
      const sub = l.lote && typeof l.lote === 'object' ? l.lote : null
      const productoId = l.productoId || (l.producto && typeof l.producto === 'object' ? l.producto._id : l.producto) || ''
      const skuLote    = l.sku || (l.producto && typeof l.producto === 'object' ? l.producto.sku : '') || ''

      // Busca el producto por ID y, si no lo encuentra, por SKU como fallback
      const prodEncontrado = productos.value.find(p =>
        String(p._id || p.id) === String(productoId) ||
        (skuLote && p.sku === skuLote)
      )

      return {
        ...l,
        numero:           l.numero || (sub ? sub.codigo : l.lote) || l.codigo || '',
        productoId,
        producto:         l.producto && typeof l.producto === 'object' ? l.producto.nombre : (l.producto || ''),
        sku:              skuLote,
        cantidad:         prodEncontrado ? prodEncontrado.stock : (l.cantidad ?? 0),
        fechaEntrada:     (l.fechaEntrada || (sub ? sub.fechaEntrada : null) || '').split('T')[0] || '',
        usaVencimiento:   l.usaVencimiento !== undefined ? l.usaVencimiento : (sub ? !!sub.usaVencimiento : !!l.fechaVencimiento),
        fechaVencimiento: (l.fechaVencimiento || (sub ? sub.fechaVencimiento : null) || '').split('T')[0] || '',
        observaciones:    l.observaciones || l.observacionLote || (sub ? sub.observacion : '') || '',
        estado:           l.estado || 'activo'
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
    console.log('📋 Movimientos backend:', data.length, 'registros. Ejemplo:', JSON.stringify(data[0]))

    historialMovimientos.value = data.map(m => {
      let productoNombre = ''
      let categoriaVal   = ''

      if (m.producto && typeof m.producto === 'object') {
        productoNombre = m.producto.nombre || ''
        // categoria viene como ObjectId crudo — cruzar con productos normalizados
        const prodRef = productos.value.find(p => String(p._id || p.id) === String(m.producto._id))
        categoriaVal = prodRef?.categoria ||
          (typeof m.producto.categoria === 'object' ? m.producto.categoria?.nombre : '') ||
          m.categoria || ''
      } else {
        const pid  = m.productoId || m.producto || ''
        const prod = pid ? productos.value.find(p => String(p._id || p.id) === String(pid)) : null
        productoNombre = prod?.nombre || ''
        categoriaVal   = prod?.categoria || m.categoria || ''
      }

      let fechaFormato = '-'
      const fechaRaw = m.fecha || m.createdAt || ''
      if (fechaRaw) {
        const dt = new Date(fechaRaw)
        if (!isNaN(dt.getTime())) fechaFormato = dt.toLocaleDateString('es-ES')
      }

      return { ...m, producto: productoNombre, categoria: categoriaVal, fechaFormato }
    })
    // ObjectIds de MongoDB son monotónicamente crecientes — el mayor es el más reciente
    .sort((a, b) => (String(b._id || '') > String(a._id || '') ? 1 : -1))

    console.log('✅ Historial cargado:', historialMovimientos.value.length, '— primero:', historialMovimientos.value[0]?.producto, historialMovimientos.value[0]?.fechaFormato)
  } catch (error) {
    console.error('❌ Error al cargar movimientos:', error)
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
      stockMax:         productoEditado.stockMax || productoEditado.movimientoMaximo || 0,
      movimientoMaximo: productoEditado.stockMax || productoEditado.movimientoMaximo || 0,
      usaLotes:         productoEditado.usaLotes,
    }
    console.log('📤 Payload limpio:', payload)
    await api.put(`/productos/${productoEditado._id || productoEditado.id}`, payload)
    await cargarProductos()
    return { success: true }
  } catch (error) {
    console.error('❌ Error respuesta backend:', JSON.stringify(error.response?.data, null, 2))
    return { success: false, error: 'Error al editar producto' }
  } finally {
    try {
      const prod = productos.value.find(p => p._id === productoEditado._id || p.id === productoEditado.id)
      verificarEstadoStock(prod)
    } catch (e) {
      console.warn('verificarEstadoStock error (no crítico):', e)
    }
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
      await cargarProductos()
      await cargarLotes()
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error al editar lote' }
    } finally {
      try {
        const prod = productos.value.find(p => p.id === loteEditado.productoId || p._id === loteEditado.productoId)
        verificarEstadoStock(prod)
      } catch (e) {
        console.warn('verificarEstadoStock error (no crítico):', e)
      }
    }
  }

  //  REGISTRAR MOVIMIENTO
  const registrarMovimiento = async (mov) => {
    try {
      await api.post('/movimientos', {
        producto: mov.productoId,
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        notas: mov.notas
      })
      await cargarProductos()
      await cargarMovimientos()
      return { success: true }
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al registrar movimiento'
      return { success: false, error: mensaje }
    } finally {
      // Verificar stock fuera del flujo crítico para que nunca bloquee el resultado
      try {
        const prod = productos.value.find(p => p.id === mov.productoId || p._id === mov.productoId)
        verificarEstadoStock(prod)
      } catch (e) {
        console.warn('verificarEstadoStock error (no crítico):', e)
      }
    }
  }

  //  ELIMINAR LOTE
  const eliminarLote = async (id) => {
    try {
      await api.delete(`/productos/lotes/${id}`)
      await cargarProductos()
      await cargarLotes()
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error al eliminar lote' }
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
    editarLote,
    eliminarLote,
    registrarMovimiento,
    agregarCategoria
  }
})