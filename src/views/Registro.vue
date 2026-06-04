<template>
  <div class="container">
    <div class="card">

      <div class="login-box">

        <!-- ICONO -->
        <img src="/images/Usericon.png" class="user-icon" />

        <!-- NOMBRE -->
        <div class="input-group">
          <label>Nombre</label>
          <div class="input-container">
            <input v-model="nombre" type="text" />
          </div>
        </div>

        <!-- APELLIDO -->
        <div class="input-group">
          <label>Apellido</label>
          <div class="input-container">
            <input v-model="apellido" type="text" />
          </div>
        </div>

        <!-- EMAIL -->
        <div class="input-group">
          <label>Email</label>
          <div class="input-container">
            <input v-model="email" type="email" />
          </div>
        </div>

        <!-- PASSWORD -->
        <div class="input-group">
          <label>Contraseña</label>
          <div class="input-container">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" />
            <img 
              :src="showPassword ? '/images/Ver-contraseña.png' : '/images/eyeclosedicon.png'"
              class="eye-icon"
              @click="togglePassword"
            />
          </div>
          <div class="password-requirements">
            <p :class="{ met: password.length >= 12 }">● Mínimo 12 caracteres</p>
            <p :class="{ met: /[A-Z]/.test(password) }">● Al menos una mayúscula</p>
            <p :class="{ met: /[0-9]/.test(password) }">● Al menos un número</p>
            <p :class="{ met: /[!@#$%^&*]/.test(password) }">● Al menos un caracter especial (!@#$%^&*)</p>
          </div>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="input-group">
          <label>Confirmar contraseña</label>
          <div class="input-container">
            <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" />
            <img 
              :src="showConfirm ? '/images/Ver-contraseña.png' : '/images/eyeclosedicon.png'"
              class="eye-icon"
              @click="toggleConfirm"
            />
          </div>
          <p v-if="confirmPassword && password !== confirmPassword" class="error-text">Las contraseñas no coinciden</p>
        </div>

      </div>

      <!-- BOTÓN -->
      <button class="login-btn" @click="registrarse">Registrarse</button>

      <!-- VOLVER AL SELECTOR -->
      <button class="back-btn" @click="$router.push('/')">Volver</button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const nombre = ref("");
const apellido = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirm = () => {
  showConfirm.value = !showConfirm.value;
};

// VALIDACIÓN Y REGISTRO
import { useUsuarioStore } from '../stores/usuario'
const usuarioStore = useUsuarioStore()

const registrarse = async () => {
  if (!nombre.value || !apellido.value || !email.value) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const isLengthValid = password.value.length >= 12;
  const hasUpper = /[A-Z]/.test(password.value);
  const hasNumber = /[0-9]/.test(password.value);
  const hasSpecial = /[!@#$%^&*]/.test(password.value);

  if (!isLengthValid || !hasUpper || !hasNumber || !hasSpecial) {
    alert("La contraseña no cumple con los requisitos mínimos de seguridad.");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const resultado = await usuarioStore.registrarse(
    nombre.value,
    apellido.value,
    email.value,
    password.value,
    confirmPassword.value
  )

  if (resultado.success) {
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    router.push("/login");
  } else {
    alert(resultado.error || "Error al registrarse");
  }
};
</script>

<style>

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
  background-image: url("/images/fondologin.png");
  background-size: cover;
  background-position: center;
  border-radius: 15px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 592px;
  height: auto;
  min-height: 419px;
  padding: 30px 0;
  background: rgba(217, 217, 217, 0.8);
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.user-icon {
  width: 45px;
  height: 45px;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  color: #000000;
  font-size: 14px;
}

.input-container {
  position: relative;
  width: 295px;
}

.input-container input {
  width: 100%;
  height: 25px;
  border: none;
  border-radius: 5px;
  padding: 2px 10px;
  box-sizing: border-box;
}

.input-container:has(.eye-icon) input {
  padding-right: 35px;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.password-requirements {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
  text-align: left;
  width: 295px;
}

.password-requirements p {
  margin: 2px 0;
  transition: color 0.3s;
}

.password-requirements p.met {
  color: #16a34a; /* Verde */
  font-weight: bold;
}

.error-text {
  font-size: 10px;
  color: #dc2626;
  margin-top: 2px;
}

.login-btn {
  margin-top: 15px;
  width: 163px;
  height: 57px;
  background: #38BDF8;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover {
  transform: scale(1.05);
}


.back-btn {
  margin-top: 10px;
  width: 163px;
  height: 57px;
  background: #38BDF8;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.back-btn:hover {
  transform: scale(1.05);
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .registro-container { max-width: 90%; }
  input { font-size: 14px; padding: 12px; }
  button { font-size: 15px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .registro-container { max-width: 95%; padding: 16px; }
  h1 { font-size: 20px; }
  input { font-size: 13px; padding: 10px; margin-bottom: 12px; }
  button { font-size: 14px; padding: 12px; width: 100%; }
  .back-btn { font-size: 14px; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .registro-container { padding: 12px; }
  h1 { font-size: 18px; }
  input { font-size: 12px; padding: 8px; }
  button { font-size: 13px; padding: 10px; }
}
</style>