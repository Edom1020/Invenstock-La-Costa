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

/* ═══════════════════════════════════════════════════════════════ */
/* ── RESPONSIVE DESIGN ── */
/* ═══════════════════════════════════════════════════════════════ */

/* ── TABLET (481px - 1024px) ── */
@media (max-width: 1024px) {
  .selector-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .selector-card { padding: 16px; }
  h2 { font-size: 14px; }
}

/* ── MOBILE (máx 480px) ── */
@media (max-width: 480px) {
  .selector-container { padding: 12px; }
  h1 { font-size: 18px; }
  .selector-grid { grid-template-columns: 1fr; gap: 12px; }
  .selector-card { padding: 12px; }
  h2 { font-size: 13px; }
  p { font-size: 12px; }
  button { font-size: 13px; padding: 10px; }
}

/* ── SMALL MOBILE (máx 360px) ── */
@media (max-width: 360px) {
  .selector-container { padding: 10px; }
  h1 { font-size: 16px; }
  .selector-card { padding: 10px; }
  h2 { font-size: 12px; }
  p { font-size: 11px; }
  button { font-size: 12px; padding: 8px; }
}
</style>