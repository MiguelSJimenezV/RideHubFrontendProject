import React, { useEffect, useState } from "react";
import { getUserChats, socket } from "../service/chat"; // Asegúrate de que socket esté importado

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getUserChats();
        setChats(data);
      } catch (error) {
        console.error("Error al obtener los chats:", error);
      }
    };

    fetchChats();

    // Escuchar por nuevos mensajes en tiempo real y actualizar el chat correspondiente
    socket.on("newMessage", (message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                lastMessage: message.content,
                lastMessageSender: message.sender.username, // Guardamos el nombre del remitente
              }
            : chat
        )
      );
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      socket.off("newMessage");
    };
  }, []);

  return (
    <div className="p-4 border-r border-gray-200 h-full">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => {
          const lastMessageSender = chat.lastMessageSender || "Desconocido"; // Nombre del remitente
          const lastMessage = chat.lastMessage || "No hay mensajes aún"; // Último mensaje
          const participant = chat.participants.find(
            (p) => p.username !== "TuUsername" // Excluir tu propio nombre de los participantes
          );

          return (
            <li
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className="cursor-pointer p-3 bg-gray-100 rounded-md hover:bg-blue-100 transition duration-150"
            >
              <div className="flex items-center">
                {/* Foto de perfil del participante */}
                <img
                  src={participant?.photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <span className="font-semibold">{participant?.username}</span>
                  <p className="text-sm text-gray-600">
                    {lastMessageSender}: {lastMessage}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
