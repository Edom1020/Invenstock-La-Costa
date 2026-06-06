import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'

const STORAGE_KEY = 'invenstock_config'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export const useConfiguracionStore = defineStore('configuracion', () => {
  const saved = loadFromStorage()

  const inventario = reactive({
    stockMinimoGlobal: saved?.inventario?.stockMinimoGlobal ?? 15,
    unidadMedida:      saved?.inventario?.unidadMedida      ?? 'u'
  })

  const notificaciones = reactive({
    email:     saved?.notificaciones?.email     ?? true,
    escritorio: saved?.notificaciones?.escritorio ?? false,
    reportes:  saved?.notificaciones?.reportes  ?? true
  })

  function guardar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inventario, notificaciones }))
  }

  watch([() => ({ ...inventario }), () => ({ ...notificaciones })], guardar, { deep: true })

  return { inventario, notificaciones, guardar }
})
