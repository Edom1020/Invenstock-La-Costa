import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useConfiguracionStore } from './configuracion'
import { useNotificacionesStore } from './notificaciones'
import { reproducirSonido } from '../services/notificaciones.service'

export const useProductosStore = defineStore('productos', () => {
  // Estado inicial con los productos que tenías en la vista
  const productos = ref([
    { id: 1, nombre: 'Tablet Pro 12.9"', descripcion: 'Apple Inc. - Silver Edition', sku: 'TAB-2024-001', categoria: 'electronica', stock: 45, stockMinimo: 10, stockMax: 50, precio: 1299000 },
    { id: 2, nombre: 'Escritorio Nórdico', descripcion: 'Madera Maciza de Roble', sku: 'FUR-WAL-120', categoria: 'hogar', stock: 3, stockMinimo: 5, stockMax: 20, precio: 450000 },
    { id: 3, nombre: 'Caja de Manzanas x40', descripcion: 'Manzana Red Delicious', sku: 'COM-APL-040', categoria: 'comida', stock: 120, stockMinimo: 50, stockMax: 200, precio: 85000 },
  ])

  // Estado para los lotes
  const lotes = ref([])

  // Estado para el historial de movimientos
  const historialMovimientos = ref([
    { id: 1, fechaFormato: '14 Mar, 2024', producto: 'Tablet Pro 12.9"', categoria: 'electronica', tipo: 'Entrada', cantidad: 5, fecha: '2024-03-14' },
  ])

  // Estado para categorías dinámicas
  const categorias = ref(['electronica', 'hogar', 'comida', 'herramientas', 'ferreteria'])

  const agregarCategoria = (nuevaCat) => {
    const catSaneada = nuevaCat.toLowerCase().trim()
    if (catSaneada && !categorias.value.includes(catSaneada)) {
      categorias.value.push(catSaneada)
    }
  }

  // Acción para agregar un producto y su lote (si aplica)
  const agregarProducto = (nuevoProducto) => {
    const id = productos.value.length + 1
    const productoConId = { ...nuevoProducto, id }
    
    // Si el producto viene con información de lote, lo extraemos y lo agregamos como un lote separado
    if (nuevoProducto.usaLotes && nuevoProducto.lote) {
      agregarLote({
        productoId: id,
        numero: nuevoProducto.lote.codigo,
        producto: nuevoProducto.nombre,
        sku: nuevoProducto.sku,
        cantidad: nuevoProducto.stock,
        fechaEntrada: nuevoProducto.lote.fechaEntrada || new Date().toISOString().split('T')[0],
        usaVencimiento: nuevoProducto.lote.usaVencimiento,
        fechaVencimiento: nuevoProducto.lote.fechaVencimiento,
        estado: 'activo',
        observaciones: nuevoProducto.lote.observacion
      })

      // Eliminamos la propiedad lote del objeto producto para mantenerlo limpio, 
      // ya que la relación es por ID en el store de lotes
      delete productoConId.lote
    }

    productos.value.push(productoConId)
    
    // Asegurar que la categoría del producto esté en nuestra lista global
    agregarCategoria(nuevoProducto.categoria)
  }

  // Acción para agregar un lote directamente (desde Lotes.vue)
  const agregarLote = (nuevoLote) => {
    lotes.value.push({
      id: lotes.value.length + 1,
      ...nuevoLote,
      estado: nuevoLote.estado || 'activo' // Asegurar estado por defecto
    })
    if (nuevoLote.productoId) {
      syncProductStock(nuevoLote.productoId)
    }
  }

  // Acción para editar un lote directamente (desde Lotes.vue)
  const editarLote = (loteEditado) => {
    const index = lotes.value.findIndex(l => l.id === loteEditado.id)
    if (index !== -1) {
      lotes.value[index] = { ...loteEditado }
      syncProductStock(loteEditado.productoId)
    }
  }

  // Acción para eliminar un lote directamente (desde Lotes.vue)
  const eliminarLote = (id) => {
    const lote = lotes.value.find(l => l.id === id)
    const prodId = lote?.productoId
    lotes.value = lotes.value.filter(l => l.id !== id)
    if (prodId) {
      syncProductStock(prodId)
    }
  }

  // Función interna para sincronizar el stock del producto basándose en sus lotes
  const syncProductStock = (productoId) => {
    if (!productoId) return
    const prod = productos.value.find(p => p.id === productoId)
    if (prod) {
      const total = lotes.value
        .filter(l => l.productoId === productoId)
        .reduce((acc, l) => acc + (l.cantidad || 0), 0)
      prod.stock = total

      console.log(`📦 Sincronizando stock para ${prod.nombre}: ${prod.stock} unidades`)

      // Lógica de conexión con Notificaciones
      const configStore = useConfiguracionStore()
      const notificacionesStore = useNotificacionesStore()

      if (prod.stock <= configStore.inventario.stockMinimoGlobal) {
        notificacionesStore.agregarNotificacion(
          'Alerta de Stock Bajo',
          `El producto "${prod.nombre}" ha alcanzado el nivel de alerta (${prod.stock} unidades).`,
          'alerta'
        )
      }

      // ── Lógica de Sonidos según el stock ──
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
  }

  // Acción para registrar movimientos y afectar el stock
  const registrarMovimiento = (mov) => {
    const prod = productos.value.find(p => p.id === mov.productoId)
    if (!prod) return

    if (mov.tipo === 'entrada') {
      // Para entradas: Crear un nuevo lote automáticamente
      agregarLote({
        productoId: prod.id,
        numero: `MOV-IN-${Date.now().toString().slice(-6)}`,
        producto: prod.nombre,
        sku: prod.sku,
        cantidad: mov.cantidad,
        fechaEntrada: mov.fecha || new Date().toISOString().split('T')[0],
        usaVencimiento: false,
        fechaVencimiento: '', // El usuario puede editarlo luego en la pantalla Lotes
        estado: 'activo',
        observaciones: mov.notas || 'Entrada automática por movimiento'
      })
    } else {
      // Para salidas: Implementar FIFO (First-In-First-Out)
      let cantidadARestara = mov.cantidad
      const lotesActivos = lotes.value
        .filter(l => l.productoId === prod.id && l.cantidad > 0)
        .sort((a, b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada))

      if (lotesActivos.reduce((sum, l) => sum + l.cantidad, 0) < cantidadARestara) {
        // No hay stock suficiente en lotes
        return { error: 'Stock insuficiente en los lotes disponibles.' }
      }

      for (const lote of lotesActivos) {
        if (cantidadARestara <= 0) break
        const disponible = lote.cantidad
        const descuento = Math.min(disponible, cantidadARestara)

        lote.cantidad -= descuento
        cantidadARestara -= descuento

        if (lote.cantidad === 0) {
          lote.estado = 'agotado'
        }
      }
      syncProductStock(prod.id)
    }

    // Registrar en el historial
    historialMovimientos.value.unshift({
      id: historialMovimientos.value.length + 1,
      fechaFormato: new Date(mov.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      producto: prod.nombre,
      categoria: prod.categoria,
      tipo: mov.tipo === 'entrada' ? 'Entrada' : 'Salida',
      cantidad: mov.cantidad,
      fecha: mov.fecha
    })

    return { success: true }
  }

  const editarProducto = (productoEditado) => {
    const index = productos.value.findIndex(p => p.id === productoEditado.id)
    if (index !== -1) {
      // RECONCILIACIÓN DE LOTES: 
      // Si el usuario cambió el stock manualmente en la tabla de productos,
      // debemos ajustar los lotes para que la suma sea igual al nuevo stock.
      const currentSum = lotes.value
        .filter(l => l.productoId === productoEditado.id)
        .reduce((acc, l) => acc + (l.cantidad || 0), 0)
      
      const newStock = productoEditado.stock

      if (currentSum !== newStock) {
        let diff = newStock - currentSum
        const productLots = lotes.value.filter(l => l.productoId === productoEditado.id)

        if (diff > 0) {
          // Si aumentó el stock, lo sumamos al lote más reciente o creamos uno de ajuste
          if (productLots.length > 0) {
            const lastLot = productLots[productLots.length - 1]
            lastLot.cantidad += diff
            lastLot.estado = 'activo'
          } else {
            agregarLote({
              productoId: productoEditado.id,
              numero: `ADJ-${Date.now().toString().slice(-4)}`,
              producto: productoEditado.nombre,
              sku: productoEditado.sku,
              cantidad: diff,
              fechaEntrada: new Date().toISOString().split('T')[0],
              estado: 'activo',
              observaciones: 'Ajuste manual desde catálogo'
            })
          }
        } else {
          // Si disminuyó el stock, restamos de los lotes (empezando por el más reciente - LIFO)
          let toSubtract = Math.abs(diff)
          const sortedLots = [...productLots].sort((a, b) => new Date(b.fechaEntrada) - new Date(a.fechaEntrada))
          for (const lote of sortedLots) {
            const deduction = Math.min(lote.cantidad, toSubtract)
            lote.cantidad -= deduction
            toSubtract -= deduction
            if (lote.cantidad === 0) lote.estado = 'agotado'
            if (toSubtract <= 0) break
          }
        }
      }

      productos.value[index] = { ...productoEditado }
      // Forzar sincronización final para asegurar consistencia
      syncProductStock(productoEditado.id)
    }
  }

  const eliminarProducto = (id) => {
    productos.value = productos.value.filter(p => p.id !== id)
    // También deberíamos limpiar los lotes asociados
    lotes.value = lotes.value.filter(l => l.productoId !== id) // Esto ya estaba bien
  }

  // Sincronización proactiva: Si se cambia el umbral global en Configuración.vue, 
  // el sistema analiza el catálogo y dispara notificaciones para los productos que entren en el rango.
  watch(() => useConfiguracionStore().inventario.stockMinimoGlobal, (nuevoUmbral) => {
    const notificacionesStore = useNotificacionesStore()
    productos.value.forEach(prod => {
      if (prod.stock <= nuevoUmbral) {
        notificacionesStore.agregarNotificacion(
          'Ajuste de Alerta Global',
          `"${prod.nombre}" clasifica como stock bajo con el nuevo umbral de ${nuevoUmbral} unidades.`,
          'alerta'
        )

        // Disparar sonido según el nivel de stock
        if (prod.stock <= 5) {
          reproducirSonido('muy_critico')
        } else if (prod.stock <= 15) {
          reproducirSonido('critico')
        } else if (prod.stock <= 30) {
          reproducirSonido('normal')
        }
      }
    })
  })

  return {
    productos,
    lotes,
    historialMovimientos,
    categorias,
    agregarLote,
    editarLote,
    eliminarLote,
    registrarMovimiento,
    agregarCategoria,
    agregarProducto,
    editarProducto,
    eliminarProducto
  }
})
