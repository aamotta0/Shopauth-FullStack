import axios from "axios";

// Creamos una instancia de axios con configuración base
// Así no tenemos que escribir la URL completa en cada petición
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// INTERCEPTOR DE PETICIONES
// Se ejecuta automáticamente antes de CADA petición que hagamos
// Aquí agregamos el token al header Authorization si existe
api.interceptors.request.use((config) => {
  // Leemos el token del localStorage del navegador
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// INTERCEPTOR DE RESPUESTAS
// Se ejecuta automáticamente cuando llega CADA respuesta
// Si el servidor responde 401, limpiamos la sesión y redirigimos al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// Interceptores son funciones que se ejecutan automáticamente en cada petición o respuesta. Es como un middleware pero del lado del cliente. Gracias a esto, el token se agrega solo en cada petición sin que tengas que recordarlo.
