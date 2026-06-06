import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket, { reproducirSonido } from '../services/notificaciones.service'
import { useConfiguracionStore } from './configuracion'

function mostrarNotifEscritorio(titulo, descripcion) {
  try {
    const cfg = useConfiguracionStore()
    if (!cfg.notificaciones.escritorio) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    new Notification(titulo, { body: descripcion, icon: '/favicon.ico' })
  } catch { /* silencioso si falla */ }
}

export const useNotificacionesStore = defineStore('notificaciones', () => {

  const notificaciones = ref([])
  const hayNuevas = ref(false)

  const noLeidas = computed(() =>
    notificaciones.value.filter(n => !n.leida).length
  )

  const conectar = () => {
    socket.connect()

    socket.on('nueva_notificacion', (data) => {
      let tipoSonido = 'normal'
      if (data.tipo === 'CRÍTICA' || data.tipo === 'MUY CRÍTICO') {
        tipoSonido = 'muy_critico'
      } else if (data.tipo === 'REPOSICIÓN URGENTE' || data.tipo === 'ALERTA') {
        tipoSonido = 'critico'
      }

      if (data.sonarAlarma) reproducirSonido(tipoSonido)

      notificaciones.value.unshift({
        id:          Date.now(),
        tipo:        mapearTipo(data.tipo),
        titulo:      data.titulo,
        descripcion: data.mensaje,
        tiempo:      'Hace unos segundos',
        leida:       false
      })

      hayNuevas.value = true
      mostrarNotifEscritorio(data.titulo, data.mensaje)
    })
  }

  const desconectar = () => {
    socket.off('nueva_notificacion')
    socket.disconnect()
  }

  const marcarLeida = (id) => {
    const notif = notificaciones.value.find(n => n.id === id)
    if (notif) notif.leida = true
    if (noLeidas.value === 0) hayNuevas.value = false
  }

  const marcarTodas = () => {
    notificaciones.value.forEach(n => n.leida = true)
    hayNuevas.value = false
  }

  const agregarNotificacion = (titulo, descripcion, tipo = 'entrada') => {
    notificaciones.value.unshift({
      id:          Date.now(),
      tipo,
      titulo,
      descripcion,
      tiempo:      'Hace unos segundos',
      leida:       false
    })
    hayNuevas.value = true
    mostrarNotifEscritorio(titulo, descripcion)
  }

  // Mapea los tipos del backend al formato de Notificaciones.vue
  const mapearTipo = (tipoBackend) => {
    const mapa = {
      'CRÍTICA':            'alerta',
      'MUY CRÍTICO':        'alerta',
      'ALERTA':             'alerta',
      'REPOSICIÓN URGENTE': 'alerta',
      'ENTRADA':            'entrada',
      'SALIDA':             'salida',
      'SISTEMA':            'sistema',
    }
    return mapa[tipoBackend] || 'sistema'
  }

  return {
    notificaciones,
    hayNuevas,
    noLeidas,
    conectar,
    desconectar,
    marcarLeida,
    marcarTodas,
    agregarNotificacion,
  }
})