<template>
  <div class="container">
    <div class="card">
      <!-- CUADRO RESET CONTRASEÑA -->
      <div class="recovery-box">
        <!-- ICONO -->
        <img src="/images/Usericon.png" class="user-icon" />

        <h2 class="title">Nueva Contraseña</h2>

        <p class="help-text">
          Ingresa tu nueva contraseña. Debe tener mínimo 12 caracteres, una mayúscula, un número y un carácter especial.
        </p>

        <!-- NUEVA CONTRASEÑA -->
        <div class="input-group">
          <label>Nueva Contraseña</label>
          <div class="input-container">
            <input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="Mínimo 12 caracteres"
            />
            <span class="toggle-eye" @click="mostrarPassword = !mostrarPassword">
              <img :src="mostrarPassword ? '/images/eyeclosedicon.png' : '/images/Ver-contraseña.png'" class="eye-icon" />
            </span>
          </div>
        </div>

        <!-- CONFIRMAR CONTRASEÑA -->
        <div class="input-group">
          <label>Confirmar Contraseña</label>
          <div class="input-container">
            <input
              v-model="confirmPassword"
              :type="mostrarConfirm ? 'text' : 'password'"
              placeholder="Repite tu contraseña"
            />
            <span class="toggle-eye" @click="mostrarConfirm = !mostrarConfirm">
              <img :src="mostrarConfirm ? '/images/eyeclosedicon.png' : '/images/Ver-contraseña.png'" class="eye-icon" />
            </span>
          </div>
        </div>

        <!-- ESTADO -->
        <div v-if="exito" class="success-message">
          ✓ Contraseña actualizada correctamente. Redirigiendo...
        </div>
        <div v-if="error" class="error-message">
          ✗ {{ error }}
        </div>
      </div>

      <!-- BOTONES -->
      <button class="send-btn" @click="resetear" :disabled="enviando">
        {{ enviando ? "Guardando..." : "Guardar Contraseña" }}
      </button>

      <button class="back-btn" @click="$router.push('/login')">Volver al Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "./api";

const router = useRouter();
const route = useRoute();

const password = ref("");
const confirmPassword = ref("");
const enviando = ref(false);
const exito = ref(false);
const error = ref("");
const mostrarPassword = ref(false);
const mostrarConfirm = ref(false);

const token = route.params.token;

const resetear = async () => {
  error.value = "";

  if (!password.value || !confirmPassword.value) {
    error.value = "Por favor completa todos los campos.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden.";
    return;
  }

  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
  if (!regex.test(password.value)) {
    error.value = "La contraseña no cumple con los requisitos de seguridad.";
    return;
  }

  enviando.value = true;

  try {
    await api.post(`/auth/reset-password/${token}`, {
      password: password.value,
      confirmPassword: confirmPassword.value
    });

    exito.value = true;

    setTimeout(() => {
      router.push("/login");
    }, 2500);

  } catch (err) {
    error.value = err.response?.data?.error || "Token inválido o expirado. Solicita un nuevo enlace.";
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
  margin: 5px 0;
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
  padding: 8px 36px 8px 12px;
  box-sizing: border-box;
  font-size: 14px;
}

.toggle-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.eye-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
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
  width: 180px;
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
  width: 180px;
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

/* ── TABLET ── */
@media (max-width: 1024px) {
  .card { width: 90%; height: auto; padding: 40px 20px; }
  .recovery-box { width: 90%; }
}

/* ── MOBILE ── */
@media (max-width: 480px) {
  .card { width: 95%; padding: 24px 12px; }
  .recovery-box { width: 100%; padding: 24px 16px; }
  .title { font-size: 20px; }
  .send-btn, .back-btn { width: 100%; font-size: 14px; }
}
</style>