// src/services/user.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// Configuración de axios para el backend
const api = axios.create({
  baseURL: API_URL, // Directamente la variable, no es necesario envolverla en un objeto
});
// Interceptor para agregar el token de autenticación
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
  throw error;
};

// Funciones de usuario
export const getAllUsers = () => api.get("/api/users/").catch(handleError);

export const getUserById = (userId) =>
  api.get(`/api/users/${userId}`).catch(handleError);

export const getUserByUsername = (username) =>
  api.get(`/api/users/search/${username}`).catch(handleError);

export const getUserProfile = (username) =>
  api.get(`/api/users/profile/${username}`).catch(handleError);

// Funciones protegidas
export const addUserToGroup = (userId, groupId) =>
  api.post("/api/users/group/addUser", { userId, groupId }).catch(handleError);

export const followUser = (userId) => {
  console.log("userId", userId);
  return api.post(`/api/users/follow/${userId}`).catch(handleError);
};

export const unfollowUser = (userId) =>
  api.post(`/api/users/unfollow/${userId}`).catch(handleError);
