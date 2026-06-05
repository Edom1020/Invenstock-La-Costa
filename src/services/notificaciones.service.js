import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
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
  muy_critico: { archivo: '/sonidos/alert-critical-urgent.mp3', volumen: 1.0, repetir: false  },
}

let audioActual = null

export const reproducirSonido = (tipoSonido) => {
  try {
    console.log(`🔊 Intentando reproducir sonido: ${tipoSonido}`)
    const config = SONIDOS[tipoSonido]
    if (!config) {
      console.warn(`⚠️ No se encontró configuración para el sonido: ${tipoSonido}`)
      return
    }

    // Si ya hay un sonido sonando y es el mismo tipo, no reiniciar
    if (audioActual && audioActual.src === config.archivo && config.repetir) {
      return audioActual
    }

    // Detener sonido anterior si existe
    if (audioActual) {
      audioActual.pause()
      audioActual.currentTime = 0
    }

    const audio = new Audio()
    audio.src = config.archivo
    audio.volume = config.volumen
    if (config.repetir) audio.loop = true

    audioActual = audio

    audio.play()
      .then(() => console.log(`✅ Sonido ${tipoSonido} reproducido con éxito`))
      .catch(err => console.error(`❌ Error al reproducir sonido ${tipoSonido}:`, err))

    return audio
  } catch (error) {
    console.error('Error en reproducirSonido:', error)
  }
}

export const detenerSonido = () => {
  if (audioActual) {
    audioActual.pause()
    audioActual.currentTime = 0
    audioActual = null
    console.log('🛑 Sonido detenido')
  }
}

socket.on('connect',    () => console.log('🟢 Conectado a notificaciones'))
socket.on('disconnect', () => console.log('🔴 Desconectado de notificaciones'))

export default socket