// src/services/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// Configuración de axios para el backend
const api = axios.create({
  baseURL: API_URL, // Directamente la variable, no es necesario envolverla en un objeto
});

// Interceptor para agregar el token de autenticación a todas las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  throw error; // Lanza el error para que pueda ser manejado donde se llame
};

// Funciones de autenticación
export const register = (userData) =>
  api.post("/api/auth/register", userData).catch(handleError);

export const login = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    const { token } = response.data;
    localStorage.setItem("authToken", token);
    return response.data; // Retorna los datos de la respuesta, que deberían incluir el token y el usuario
  } catch (error) {
    handleError(error); // Llama a la función de manejo de errores
  }
};

export const getUsers = () => api.get("/api/auth/users").catch(handleError); // Asegúrate de manejar el error aquí también

// Funciones protegidas con autenticación
export const getProfile = () => api.get("/api/auth/profile").catch(handleError);

export const updateProfile = (profileData) =>
  api.put("/api/auth/profile", profileData).catch(handleError);

export const updateRole = (userId, role) => {
  const roleData = { userId, role };
  return api.put("/api/auth/profile/role", roleData).catch(handleError);
};

export const deleteAccount = (userId) => {
  return api.delete(`/api/auth/profile/${userId}`).catch(handleError);
};
