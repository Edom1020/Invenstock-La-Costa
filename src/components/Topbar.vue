<template>
  <header class="topbar">
    <!-- LADO IZQUIERDO: Búsqueda -->
    <div class="search-wrap">
      <img src="/images/images-dashboard/lupaicon.png" class="search-icon" />
      <input 
        type="text" 
        placeholder="Buscar productos..." 
        @input="$emit('buscar', $event.target.value)"
      />
    </div>

    <!-- LADO DERECHO: Acciones de usuario -->
    <div class="topbar-right">
      
      <!-- Tu componente de notificaciones con el dropdown -->
      <Notificaciones />

      <!-- Foto de Perfil (Avatar) -->
      <div class="avatar-btn">
        <img :src="usuarioStore.fotoPerfil" class="avatar-img" />
      </div>

    </div>
  </header>
</template>

<script setup>
import Notificaciones from './Notificaciones.vue'
import { useUsuarioStore } from '../stores/usuario'

const usuarioStore = useUsuarioStore()

defineProps({
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
})

defineEmits(['buscar'])
</script>


<style scoped>
/* ── TOPBAR ── */
.topbar {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  background: var(--bg-topbar);
  border-bottom: 1px solid var(--borde);
  height: 64px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border-radius: 20px;
  padding: 8px 16px;
  flex: 1;
  max-width: 400px;
  margin-right: auto; /* Empuja el contenido de la derecha */
}


.search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--txt-normal);
  width: 100%;
  min-width: 0;          /* ← permite que el input se reduzca */
}

.search-wrap input::placeholder { color: var(--txt-muted); }

.search-icon { 
  width: 15px; height: 15px; 
  object-fit: contain;
  flex-shrink: 0;        /* ← el icono no se encoge */
}

.avatar-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0ea5e9;
  border: 2px solid #38bdf8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* ── RESPONSIVE TOPBAR ── */

/* TABLET */
@media (max-width: 1024px) {
  .topbar { padding: 12px 20px; }
  .search-wrap { max-width: 260px; }
}

/* MOBILE */
@media (max-width: 768px) {
  .topbar { padding: 10px 14px; gap: 8px; }
  .search-wrap { 
    max-width: 180px; 
    padding: 6px 10px;
  }
  .search-wrap input { font-size: 12px; }
}

/* SMALL MOBILE */
@media (max-width: 480px) {
  .topbar { padding: 8px 12px; gap: 6px; }
  .search-wrap { 
    max-width: 130px;
    padding: 5px 8px;
  }
  .search-icon { width: 13px; height: 13px; }
  .search-wrap input { font-size: 11px; }
  .avatar-btn { width: 28px; height: 28px; }
}
</style>