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
            <input type="text" />
          </div>
        </div>

        <!-- APELLIDO -->
        <div class="input-group">
          <label>Apellido</label>
          <div class="input-container">
            <input type="text" />
          </div>
        </div>

        <!-- EMAIL -->
        <div class="input-group">
          <label>Email</label>
          <div class="input-container">
            <input type="email" />
          </div>
        </div>

        <!-- PASSWORD -->
        <div class="input-group">
          <label>Contraseña</label>
          <div class="input-container">
            <input :type="showPassword ? 'text' : 'password'" />
            <img 
              src="/images/Ver-contraseña.png"
              class="eye-icon"
              @click="togglePassword"
            />
          </div>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="input-group">
          <label>Confirmar contraseña</label>
          <div class="input-container">
            <input :type="showConfirm ? 'text' : 'password'" />
            <img 
              src="/images/Ver-contraseña.png"
              class="eye-icon"
              @click="toggleConfirm"
            />
          </div>
        </div>

      </div>

      <!-- BOTÓN -->
      <button class="login-btn">Registrarse</button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showPassword = ref(false);
const showConfirm = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirm = () => {
  showConfirm.value = !showConfirm.value;
};
</script>

<style>
/* REUTILIZA EXACTAMENTE EL MISMO CSS DEL LOGIN */
/* Puedes copiar el mismo estilo sin cambiar nada */

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
  height: 419px;
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
</style>