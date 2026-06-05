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
  const categorias = ref(['electronica', 'hogar', 'comida', 'herramientas', 'ferreteria'])
  const cargando = ref(false)

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
    console.log('🏷️ Primer producto del backend:', JSON.stringify(res.data.data?.[0], null, 2))
    productos.value = (res.data.data || []).map(p => ({
      ...p,
      categoria: typeof p.categoria === 'string'
        ? p.categoria
        : (p.categoria?.nombre || 'sin-categoria')
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
    lotes.value = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.lotes || [])
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
    historialMovimientos.value = data.map(m => ({
      ...m,
      // Normaliza producto si viene populado como objeto
      productoNombre: m.producto?.nombre || m.producto || 'Producto desconocido',
      categoria: typeof m.categoria === 'string'
        ? m.categoria
        : (m.producto?.categoria?.nombre || m.producto?.categoria || '')
    }))
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
      categoria:        typeof productoEditado.categoria === 'string'
                          ? productoEditado.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                          : productoEditado.categoria,
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

  //  EDITAR LOTE
  const editarLote = async (loteEditado) => {
    try {
      await api.put(`/productos/lotes/${loteEditado.id || loteEditado._id}`, {
        lote: loteEditado.numero,
        sku: loteEditado.sku,
        fechaVencimiento: loteEditado.fechaVencimiento,
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
        productoId: mov.productoId,
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        fecha: mov.fecha,
        notas: mov.notas
      })
      await cargarProductos()
      await cargarMovimientos()

      // Trigger logic for sounds and notifications
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
    cargarLotes,
    cargarMovimientos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    editarLote,
    registrarMovimiento,
    agregarCategoria
  }
})
