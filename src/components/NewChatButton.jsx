import React, { useState, useEffect } from "react";
import { getAllUsers, createChat } from "../service/chat";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const NewChatButton = ({ onChatCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Redirigir si no está logueado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirige a la página de login
    }
  }, [isAuthenticated, navigate]); // Dependemos de isAuthenticated para hacer la verificación

  // Obtener usuarios solo cuando el usuario esté autenticado
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        setError("Error al obtener los usuarios");
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers(); // Solo obtenemos los usuarios si está autenticado
    }
  }, [isAuthenticated]); // Solo vuelve a ejecutarse cuando cambie la autenticación

  // Manejo de la creación del chat
  const handleCreateChat = async (otherUserId) => {
    if (creatingChat) return; // Evitar crear un chat si ya se está creando
    setCreatingChat(true);

    const userId = localStorage.getItem("userId");

    if (!userId || !otherUserId) {
      setError("Falta el ID del usuario actual o del otro usuario");
      setCreatingChat(false);
      return;
    }

    try {
      const newChat = await createChat(userId, otherUserId);
      onChatCreated(newChat);
      setIsOpen(false);
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "Error desconocido"
      );
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150"
      >
        Crear Chat
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Selecciona un usuario</h3>
            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleCreateChat(user._id)}
                  className="cursor-pointer p-2 bg-gray-100 rounded-md hover:bg-blue-100 transition duration-150"
                >
                  {user.username}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewChatButton;
