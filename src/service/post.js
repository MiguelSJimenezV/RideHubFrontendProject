// src/services/PostService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// Configuración de axios para el backend
const api = axios.create({
  baseURL: API_URL, // Directamente la variable, no es necesario envolverla en un objeto
});
// Interceptor para agregar token a las solicitudes
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

// Funciones para interactuar con las publicaciones
export const getPosts = async () => {
  try {
    const response = await api.get("/api/posts/");
    return response.data; // Retorna los datos de las publicaciones
  } catch (error) {
    handleError(error);
  }
};

export const getPostById = async (id) => {
  try {
    const response = await api.get(`/api/posts/${id}`);
    return response.data; // Retorna los datos de la publicación
  } catch (error) {
    handleError(error);
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/posts/user/${userId}`); // Ajusta la ruta si es necesario
    return response.data;
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    throw error; // Re-lanza el error
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post("/api/posts/", postData);
    return response.data; // Retorna la publicación creada
  } catch (error) {
    handleError(error);
  }
};

// Función para actualizar una publicación
export const updatePost = async (postId, updatedData) => {
  try {
    const response = await api.put(`/api/posts/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para eliminar una publicación
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error en deletePost:", error.response || error.message);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

export const likePost = async (id) => {
  try {
    const response = await api.post(`/api/posts/${id}/like`);
    return response.data; // Retorna el resultado del "like"
  } catch (error) {
    handleError(error);
  }
};

export const commentOnPost = async (id, commentData) => {
  try {
    const response = await api.post(`/api/posts/${id}/comment`, commentData);
    return response.data; // Retorna el comentario creado
  } catch (error) {
    handleError(error);
  }
};

export const getRelatedPosts = async (postId) => {
  try {
    const response = await api.get(`/api/posts/${postId}/related`);
    return response.data; // Retorna las publicaciones relacionadas
  } catch (error) {
    handleError(error);
  }
};
