import axios from "axios";

// Configuración de la URL de la API
const API_URL = import.meta.env.VITE_API_URL; // Tomar la URL desde .env o localhost como fallback

// Crear una instancia de axios
const api = axios.create({
  baseURL: API_URL, // Asegúrate de que esta URL coincide con tu backend
});

// Interceptor para agregar token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Crear comunidad
export const createCommunity = async (communityData) => {
  try {
    console.log(communityData);
    const response = await api.post("/api/communities", communityData);
    return response.data;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
};

// Obtener todas las comunidades
export const getAllCommunities = async () => {
  try {
    const response = await api.get("/api/communities");
    return response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

export const getCommunityById = async (communityId) => {
  try {
    const response = await api.get(`/api/communities/${communityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching community:", error);
    throw error;
  }
};

// Obtener comunidades por usuario
export const getCommunityByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/communities/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user communities:", error);
    throw error;
  }
};

// Actualizar comunidad
export const updateCommunity = async (communityId, communityData) => {
  try {
    const response = await api.put(
      `/api/communities/${communityId}`,
      communityData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating community:", error);
    throw error;
  }
};

// Eliminar comunidad
export const deleteCommunity = async (communityId) => {
  try {
    const response = await api.delete(`/api/communities/${communityId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting community:", error);
    throw error;
  }
};

// Unirse a una comunidad
export const joinCommunity = async (communityId, userId) => {
  try {
    const response = await api.post("/api/communities/join", {
      communityId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error joining community:", error);
    throw error;
  }
};

// Dejar una comunidad
export const leaveCommunity = async (communityId, userId) => {
  try {
    const response = await api.post("/api/communities/leave", {
      communityId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error leaving community:", error);
    throw error;
  }
};

// Enviar mensaje a la comunidad
export const sendCommunityMessage = async (messageData) => {
  try {
    console.log(messageData);
    const response = await api.post("/api/communities/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Obtener mensajes de la comunidad
export const getCommunityMessages = async (communityId) => {
  try {
    const response = await api.get(`/api/communities/${communityId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Obtener chatId de la comunidad
export const getChatId = async (communityId) => {
  try {
    const response = await api.get(`/api/communities/${communityId}/chat`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chatId:", error);
    throw error;
  }
};

// Obtener comunidades del usuario
export const getUserCommunities = async () => {
  try {
    const response = await api.get("/api/communities/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user communities:", error);
    throw error;
  }
};

// Obtener miembros de la comunidad
export const getCommunityMembers = async (communityId) => {
  try {
    const response = await api.get(`/api/communities/${communityId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching community members:", error);
    throw error;
  }
};

// Obtener comunidades creadas por el usuario
export const getUserCreatedCommunities = async () => {
  try {
    const response = await api.get("/api/communities/user/created");
    return response.data;
  } catch (error) {
    console.error("Error fetching user created communities:", error);
    throw error;
  }
};
