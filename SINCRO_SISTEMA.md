# Documentación de Sincronización de Inventario (Productos, Lotes y Movimientos)

Este documento detalla las mejoras implementadas para convertir el sistema de inventario en un modelo integrado donde los movimientos afectan a los lotes y los lotes definen el stock de los productos.

## 1. Sincronización de Stock (Lotes $\rightarrow$ Productos)

Se implementó un mecanismo de "única fuente de verdad". Ahora, el stock de un producto es la suma de todas las cantidades de sus lotes asociados.

### Función de Sincronización (`src/stores/productos.js`)
Se añadió la función `syncProductStock` para recalcular el stock total:

```javascript
const syncProductStock = (productoId) => {
  if (!productoId) return
  const prod = productos.value.find(p => p.id === productoId)
  if (prod) {
    const total = lotes.value
      .filter(l => l.productoId === productoId)
      .reduce((acc, l) => acc + (l.cantidad || 0), 0)
    prod.stock = total
  }
}
```

### Integración en Acciones de Lotes
Se integró esta función en todas las acciones que modifican la cantidad de lotes:
- **`agregarLote`**: Actualiza el producto al crear un nuevo lote.
- **`editarLote`**: Actualiza el producto cuando se cambia la cantidad de un lote existente.
- **`eliminarLote`**: Recalcula el stock al borrar un lote.

---

## 2. Lógica de Movimientos Avanzada

Se transformó la función `registrarMovimiento` para que no solo cambie un número, sino que gestione la trazabilidad de los lotes.

### A. Entradas Automáticas
Cuando se registra una **Entrada**, el sistema ya no solo suma al stock, sino que crea un registro de lote automáticamente:

```javascript
if (mov.tipo === 'entrada') {
  agregarLote({
    productoId: prod.id,
    numero: `MOV-IN-${Date.now().toString().slice(-6)}`,
    producto: prod.nombre,
    sku: prod.sku,
    cantidad: mov.cantidad,
    fechaEntrada: mov.fecha || new Date().toISOString().split('T')[0],
    estado: 'activo',
    observaciones: mov.notas || 'Entrada automática por movimiento'
  })
}
```

### B. Salidas mediante FIFO (First-In, First-Out)
Para las **Salidas**, el sistema ahora descuenta la cantidad de los lotes más antiguos primero:

```javascript
// 1. Buscar lotes activos ordenados por fecha de entrada (más antiguos primero)
const lotesActivos = lotes.value
  .filter(l => l.productoId === prod.id && l.cantidad > 0)
  .sort((a, b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada))

// 2. Descontar secuencialmente
for (const lote of lotesActivos) {
  if (cantidadARestara <= 0) break
  const descuento = Math.min(lote.cantidad, cantidadARestara)
  lote.cantidad -= descuento
  cantidadARestara -= descuento

  if (lote.cantidad === 0) lote.estado = 'agotado'
}
```

---

## 3. Mejoras de Interfaz y Usuario (UX)

### A. Selector de Productos Dinámico (`src/views/Movimientos.vue`)
Se corrigió la selección de productos para que los productos sin categoría o con categorías nuevas aparezcan siempre en un grupo llamado **"Otros"**, evitando que desaparezcan del menú.

```html
<optgroup v-if="productosStore.productos.some(p => !p.categoria || !productosStore.categorias.includes(p.categoria))" label="Otros">
  <option v-for="p in productosStore.productos.filter(prod => !prod.categoria || !productosStore.categorias.includes(prod.categoria))" :key="p.id" :value="p.id">
    {{ p.nombre }}
  </option>
</optgroup>
```

### B. Validación de Cantidad Cero (`src/views/Lotes.vue`)
Se corrigió el error que impedía poner `0` en la cantidad de un lote durante la edición. Se cambió la validación de "falsy" (`!cantidad`) a una comprobación explícita de nulos.

```javascript
// Antes: !loteTrabajo.value.cantidad (0 era tratado como error)
// Ahora:
loteTrabajo.value.cantidad === null || loteTrabajo.value.cantidad === undefined
```

### C. Corrección de Fechas
Se ajustó la función `formatDate` para evitar que las fechas se desplacen un día atrás debido a la interpretación de UTC de JavaScript.