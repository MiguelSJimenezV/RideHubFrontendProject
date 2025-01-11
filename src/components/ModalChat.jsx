import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5173"); // Cambia la URL por la de tu servidor

const ChatModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Escuchar el evento de respuesta del servidor si es necesario
    socket.on("chatCreated", (data) => {
      setSuccess(`Chat creado exitosamente con ${data.username}`);
      setUsername(""); // Limpiar el campo
      onClose(); // Cerrar el modal
    });

    return () => {
      socket.off("chatCreated"); // Limpiar el listener al desmontar
    };
  }, [onClose]);

  const handleCreateChat = () => {
    if (!username.trim()) {
      setError("Por favor, ingrese un nombre de usuario.");
      setSuccess("");
      return;
    }

    // Emitir un evento al servidor para crear el chat
    socket.emit("createChat", { username: username.trim() });

    // Reiniciar mensajes
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl mb-4">Crear Chat Privado</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleCreateChat}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
        <button onClick={onClose} className="ml-4 text-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
