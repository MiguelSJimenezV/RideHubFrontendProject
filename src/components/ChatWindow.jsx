import React, { useEffect, useState, useRef } from "react";
import { getChatMessages, sendMessage, socket } from "../service/chat";
import { useAuth } from "../context/AuthContext";

const ChatWindow = ({ chatId }) => {
  const { user } = useAuth(); // Obtenemos el usuario logueado desde AuthContext
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chatId) {
          const data = await getChatMessages(chatId);
          setMessages(data);
        }
      } catch (error) {
        console.error("Error al cargar los mensajes:", error);
      }
    };

    fetchMessages();

    socket.emit("joinChat", chatId);

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage");
      socket.emit("leaveChat", chatId);
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const message = await sendMessage(chatId, newMessage);
        socket.emit("sendMessage", { chatId, message });
        setNewMessage("");
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md shadow-sm mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 rounded-lg ${
              msg.sender._id === user._id
                ? "bg-blue-100 text-right ml-auto" // Mensajes del usuario logueado alineados a la derecha
                : "bg-gray-200 text-left mr-auto" // Mensajes recibidos alineados a la izquierda
            }`}
            style={{ maxWidth: "75%" }}
          >
            <span className="font-bold">{msg.sender.username}:</span>{" "}
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
