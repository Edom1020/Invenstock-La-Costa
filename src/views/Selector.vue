<template>
  <div class="container">

    <div class="card">
      
      <!-- Logo -->
      <img src="/images/logoclaro.png" class="logo" />

      <!-- Botones -->
      <div class="buttons">
        <button @click="goLogin">Iniciar Sesión</button>
        <button @click="goRegistro">Registrarse</button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goLogin = () => {
  router.push("/login");
};

const goRegistro = () => {
  router.push("/registro");
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

/* CONTENEDOR PRINCIPAL (IMAGEN DEL MAR) */
.card {
  width: 1204px;
  height: 720px;
  background-image: url("/images/fondologin.png");
  background-size: cover;
  background-position: center;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

/* LOGO */
.logo {
  width: 796px;
  border-radius: 50px;
}

/* BOTONES */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

button {
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

button:hover {
  transform: scale(1.05);
}
</style>