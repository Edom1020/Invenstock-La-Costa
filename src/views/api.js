import axios from 'axios';
import { useUsuarioStore } from '../stores/usuario';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use((config) => {
  const usuarioStore = useUsuarioStore();
  const token = usuarioStore.token; 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;