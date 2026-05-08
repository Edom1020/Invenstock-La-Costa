<template>
  <div class="container">

    <div class="card">

      <!-- CUADRO LOGIN -->
      <div class="login-box">

        <!-- ICONO -->
        <img src="/images/Usericon.png" class="user-icon" />

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
              src="/images/Ver-contraseña.png" 
              class="eye-icon"
              @click="togglePassword"
            />
          </div>

          <span class="forgot">¿Olvidaste tu contraseña?</span>
        </div>

      </div>

      <!-- BOTÓN -->
      <button class="login-btn" @click="iniciarSesion">Iniciar Sesión</button>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const iniciarSesion = () => {
  if (!email.value || !password.value) { 
    alert("Por favor, completa todos los campos.");
    return;
  }
  router.push("/dashboard");

}


</script>

<style>
.container {
  height: 100vh;
  background: #F2F2F2;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* IMAGEN DEL MAR */
.card {
  width: 1204px;
  height: 720px;
  background-image: url("/images/mar.png");
  background-size: cover;
  background-position: center;
  border-radius: 15px;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* CUADRO LOGIN */
.login-box {
  width: 592px;
  height: 419px;
  background: rgba(217, 217, 217, 0.8);
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
}

/* ICONO */
.user-icon {
  width: 45px;
  height: 45px;
  margin-bottom: 10px;
}

/* INPUTS */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

label {
  color: #000000;
  font-size: 14px;
}

/* CONTENEDOR UNIFICADO */
.input-container {
  position: relative;
  width: 295px;
}

/* INPUT BASE */
.input-container input {
  width: 100%;
  height: 25px;
  border: none;
  border-radius: 5px;
  padding: 2px 10px;
  box-sizing: border-box;
}



/* ICONO OJO */
.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* TEXTO OLVIDÓ */
.forgot {
  font-size: 12px;
  color: #000000;
  margin-top: 5px;
}

/* BOTÓN */
.login-btn {
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

.login-btn:hover {
  transform: scale(1.05);
}
</style>