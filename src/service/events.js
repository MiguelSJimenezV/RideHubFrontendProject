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

// Funciones de eventos
export const createEvent = (eventData) => {
  try {
    const response = api.post("/api/events/", eventData);
    return response.data;
  } catch (error) {
    return console.error("Error al crear evento:", error);
  }
};

export const updateEvent = (eventId, eventData) => {
  api.put(`/api/events/${eventId}`, eventData).catch(handleError);
};

export const deleteEvent = (eventId) =>
  api.delete(`/api/events/${eventId}`).catch(handleError);

export const getEventById = (id) =>
  api.get(`/api/events/${id}`).catch(handleError); // Asegúrate de que la URL sea correcta

export const getEvents = () => api.get("/api/events/").catch(handleError);

export const getEventsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/events/user/${userId}`); // Ajusta la ruta si es necesario
    return response.data;
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    throw error; // Re-lanza el error
  }
};

export const joinEvent = async (eventId) => {
  try {
    const response = await api.post(`/api/events/${eventId}/join`);
    // Validar la respuesta
    if (response && response.data && response.data.event) {
      return response.data; // Retorna el resultado de unirse al evento
    } else {
      throw new Error(
        "La respuesta del servidor no tiene la estructura esperada."
      );
    }
  } catch (error) {
    handleError(error); // Maneja el error de la solicitud
    return { error: "Error al unirse al evento" }; // Retorna un objeto con error
  }
};

export const leaveEvent = async (eventId) => {
  try {
    const response = await api.post(`/api/events/${eventId}/leave`);
    // Validar la respuesta
    if (response && response.data && response.data.event) {
      return response.data; // Retorna el resultado de dejar el evento
    } else {
      throw new Error(
        "La respuesta del servidor no tiene la estructura esperada."
      );
    }
  } catch (error) {
    handleError(error); // Maneja el error de la solicitud
    return { error: "Error al abandonar el evento" }; // Retorna un objeto con error
  }
};

export const getEventsByDate = (date) =>
  api.get(`/api/events/date/${date}`).catch(handleError);

export const getEventsByLocation = (location) =>
  api.get(`/api/events/location/${location}`).catch(handleError);

export const getEventsByTitle = (title) =>
  api.get(`/api/events/title/${title}`).catch(handleError);

export const getEventsByDescription = (description) =>
  api.get(`/api/events/description/${description}`).catch(handleError);

export const likeEvent = async (id) => {
  try {
    const response = await api.post(`/api/events/${id}/like`);
    return response.data; // Retorna el resultado del "like"
  } catch (error) {
    handleError(error);
  }
};

export const commentOnEvent = async (id, commentData) => {
  try {
    const response = await api.post(`/api/events/${id}/comment`, commentData);
    return response.data; // Retorna el comentario creado
  } catch (error) {
    handleError(error);
  }
};

export const getRelatedEvents = async (eventId) => {
  try {
    const response = await api.get(`/api/events/${eventId}/related`);
    return response.data; // Retorna las publicaciones relacionadas
  } catch (error) {
    handleError(error);
  }
};
