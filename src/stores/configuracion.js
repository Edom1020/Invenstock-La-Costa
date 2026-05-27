import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useConfiguracionStore = defineStore('configuracion', () => {
  // Configuración de inventario
  const inventario = reactive({
    stockMinimoGlobal: 15, // Stock mínimo por defecto para alertas
    unidadMedida: 'u'      // Unidad de medida por defecto
  })

  // Otras configuraciones (ej. notificaciones, etc.)
  const notificaciones = reactive({
    email: true,
    escritorio: false,
    reportes: true
  })

  return { inventario, notificaciones }
})
