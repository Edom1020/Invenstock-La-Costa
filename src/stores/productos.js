import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductosStore = defineStore('productos', () => {
  // Estado inicial con los productos que tenías en la vista
  const productos = ref([
    { id: 1, nombre: 'Tablet Pro 12.9"', descripcion: 'Apple Inc. - Silver Edition', sku: 'TAB-2024-001', categoria: 'electronica', stock: 45, stockMax: 50, precio: 1299000 },
    { id: 2, nombre: 'Escritorio Nórdico', descripcion: 'Madera Maciza de Roble', sku: 'FUR-WAL-120', categoria: 'hogar', stock: 3, stockMax: 20, precio: 450000 },
    { id: 3, nombre: 'Caja de Manzanas x40', descripcion: 'Manzana Red Delicious', sku: 'COM-APL-040', categoria: 'comida', stock: 120, stockMax: 200, precio: 85000 },
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
  }

  // Acción para editar un lote directamente (desde Lotes.vue)
  const editarLote = (loteEditado) => {
    const index = lotes.value.findIndex(l => l.id === loteEditado.id)
    if (index !== -1) {
      lotes.value[index] = { ...loteEditado }
    }
  }

  // Acción para eliminar un lote directamente (desde Lotes.vue)
  const eliminarLote = (id) => {
    lotes.value = lotes.value.filter(l => l.id !== id)
    // Opcional: Si un lote se elimina, ¿debería afectar el stock del producto?
    // Por ahora, no lo haremos automáticamente para evitar complejidad.
  }

  // Acción para registrar movimientos y afectar el stock
  const registrarMovimiento = (mov) => {
    const prod = productos.value.find(p => p.id === mov.productoId)
    if (prod) {
      if (mov.tipo === 'entrada') {
        prod.stock += mov.cantidad
      } else {
        prod.stock -= mov.cantidad
      }
      
      historialMovimientos.value.unshift({
        id: historialMovimientos.value.length + 1,
        fechaFormato: new Date(mov.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        producto: prod.nombre,
        categoria: prod.categoria,
        tipo: mov.tipo === 'entrada' ? 'Entrada' : 'Salida',
        cantidad: mov.cantidad,
        fecha: mov.fecha // Guardar la fecha completa para filtros
      })
      // Opcional: Generar notificación de movimiento
    }
  }

  const editarProducto = (productoEditado) => {
    const index = productos.value.findIndex(p => p.id === productoEditado.id)
    if (index !== -1) {
      productos.value[index] = { ...productoEditado }
    }
  }

  const eliminarProducto = (id) => {
    productos.value = productos.value.filter(p => p.id !== id)
    // También deberíamos limpiar los lotes asociados
    lotes.value = lotes.value.filter(l => l.productoId !== id) // Esto ya estaba bien
  }

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
