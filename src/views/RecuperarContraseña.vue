<template>
  <div class="container">
    <div class="card">
      <!-- CUADRO RECUPERAR CONTRASEÑA -->
      <div class="recovery-box">
        <!-- ICONO -->
        <img src="/images/Usericon.png" class="user-icon" />

        <h2 class="title">Recuperar Contraseña</h2>

        <!-- EMAIL -->
        <div class="input-group">
          <label>Ingresa tu Email</label>
          <div class="input-container">
            <input v-model="email" type="email" placeholder="tu@email.com" />
          </div>
        </div>

        <!-- MENSAJE DE AYUDA -->
        <p class="help-text">
          Te enviaremos un enlace para que puedas restablecer tu contraseña
        </p>

        <!-- ESTADO DEL ENVÍO -->
        <div v-if="enviado" class="success-message">
          ✓ Se ha enviado un enlace de recuperación a tu email
        </div>
        <div v-if="error" class="error-message">
          ✗ {{ error }}
        </div>
      </div>

      <!-- BOTONES -->
      <button class="send-btn" @click="enviarEmail" :disabled="enviando">
        {{ enviando ? "Enviando..." : "Enviar Enlace" }}
      </button>

      <button class="back-btn" @click="$router.push('/login')">Volver al Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const enviando = ref(false);
const enviado = ref(false);
const error = ref("");

const enviarEmail = async () => {
  // Validar email
  if (!email.value) {
    error.value = "Por favor ingresa tu email";
    return;
  }

  if (!email.value.includes("@")) {
    error.value = "Email inválido";
    return;
  }

  enviando.value = true;
  error.value = "";

  try {
    // AQUÍ IRRÍA TU LLAMADA A LA API/BACKEND
    // Por ahora simularemos un delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Si la API retorna éxito:
    enviado.value = true;

    // Opcional: Volver al login después de 3 segundos
    setTimeout(() => {
      router.push("/login");
    }, 3000);

  } catch (err) {
    error.value = "Error al enviar el email. Intenta nuevamente.";
  } finally {
    enviando.value = false;
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  background: #F2F2F2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 1204px;
  height: 720px;
  background-image: url("/images/mar.png");
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.recovery-box {
  width: 592px;
  background: rgba(217, 217, 217, 0.8);
  border-radius: 10px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.user-icon {
  width: 45px;
  height: 45px;
  margin-bottom: 10px;
}

.title {
  font-size: 24px;
  color: #000000;
  margin: 10px 0;
}

.help-text {
  font-size: 13px;
  color: #555555;
  text-align: center;
  margin: 10px 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

label {
  color: #000000;
  font-size: 14px;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-container input {
  width: 100%;
  height: 35px;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  box-sizing: border-box;
  font-size: 14px;
}

.success-message {
  width: 100%;
  padding: 12px;
  background: #D4EDDA;
  color: #155724;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #C3E6CB;
}

.error-message {
  width: 100%;
  padding: 12px;
  background: #F8D7DA;
  color: #721C24;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #F5C6CB;
}

.send-btn {
  margin-top: 15px;
  width: 163px;
  height: 57px;
  background: #38BDF8;
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-btn {
  margin-top: 10px;
  width: 163px;
  height: 57px;
  background: #38BDF8;
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.back-btn:hover {
  transform: scale(1.05);
}
</style>
