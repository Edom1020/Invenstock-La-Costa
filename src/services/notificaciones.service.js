import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  autoConnect: false
})

// ── SONIDOS ──
const SONIDOS = {
  normal:      { archivo: '/sonidos/alert-normal.mp3',          volumen: 0.5, repetir: false },
  critico:     { archivo: '/sonidos/alert-critical.mp3',        volumen: 0.8, repetir: false },
  muy_critico: { archivo: '/sonidos/alert-critical-urgent.mp3', volumen: 1.0, repetir: true  },
}

export const reproducirSonido = (tipoSonido) => {
  try {
    const config = SONIDOS[tipoSonido]
    if (!config) return
    const audio = new Audio(config.archivo)
    audio.volume = config.volumen
    if (config.repetir) audio.loop = true
    audio.play().catch(err => console.error('Error al reproducir sonido:', err))
    return audio
  } catch (error) {
    console.error('Error en reproducirSonido:', error)
  }
}

export const detenerSonido = (audioElement) => {
  if (audioElement) {
    audioElement.pause()
    audioElement.currentTime = 0
  }
}

socket.on('connect',    () => console.log('🟢 Conectado a notificaciones'))
socket.on('disconnect', () => console.log('🔴 Desconectado de notificaciones'))

export default socket