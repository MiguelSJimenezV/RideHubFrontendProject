import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getCommunityById,
  sendCommunityMessage,
  joinCommunity,
  leaveCommunity,
} from "../../service/community";
import { useAuth } from "../../context/AuthContext";
import { getUserById } from "../../service/user";
import SecondaryButton from "../Button/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const CommunityChat = () => {
  const { communityId } = useParams(); // Obtén el ID de la comunidad
  const { user } = useAuth(); // Contexto de autenticación
  const [communityData, setCommunityData] = useState({});
  const [communityMessages, setCommunityMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState({}); // Almacenar detalles de usuarios
  const messagesEndRef = useRef(null);
  // Ref para el scroll al último mensaje
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const community = await getCommunityById(communityId);
        setCommunityData(community);
        setCommunityMessages(community.chatId?.messages || []); // Manejo seguro de mensajes

        // Obtén los usuarios que han enviado mensajes
        const userIds =
          community.chatId?.messages?.map((msg) => msg.sender) || [];
        const usersData = {};

        // Para evitar obtener el mismo usuario varias veces, hacer una única solicitud
        await Promise.all(
          userIds.map(async (userId) => {
            if (!usersData[userId]) {
              const user = await getUserById(userId);
              usersData[userId] = user;
            }
          })
        );

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de la comunidad:", error);
        setError("No se pudo cargar la comunidad.");
      }
    };
    fetchData();
  }, [communityId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Validación para evitar mensajes vacíos
    try {
      const newMessage = await sendCommunityMessage({
        communityId: communityId,
        sender: user.id, // Asegúrate de enviar el ID del usuario
        content: message,
      });
      setCommunityMessages([...communityMessages, newMessage]); // Agrega el mensaje nuevo
      setMessage("");

      // Desliza al último mensaje
      scrollToBottom();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setError("No se pudo enviar el mensaje.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  console.log(users[communityMessages[0]?.sender]?.data);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100   ">
        <div className="loader">
          <svg
            xml:space="preserve"
            viewBox="0 0 254.532 254.532"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            id="Capa_1"
            version="1.1"
            className="wheel"
          >
            <g>
              <path
                d="M127.267,0C57.092,0,0,57.091,0,127.266s57.092,127.266,127.267,127.266c70.174,0,127.266-57.091,127.266-127.266
				S197.44,0,127.267,0z M127.267,217.656c-49.922,0-90.391-40.468-90.391-90.39s40.469-90.39,90.391-90.39
				c49.92,0,90.39,40.468,90.39,90.39S177.186,217.656,127.267,217.656z"
                id="tire"
              ></path>
              <path
                d="M127.267,48.578c-43.39,0-78.689,35.299-78.689,78.688c0,43.389,35.3,78.688,78.689,78.688
				c43.389,0,78.688-35.299,78.688-78.688C205.955,83.877,170.655,48.578,127.267,48.578z M195.878,122.249h-38.18
				c-0.78-4.825-2.686-9.275-5.435-13.079l26.954-26.954C188.679,93.112,194.771,106.996,195.878,122.249z M132.204,58.648
				c15.244,1.087,29.123,7.156,40.025,16.591l-26.948,26.949c-3.804-2.748-8.253-4.653-13.077-5.433V58.648z M122.329,58.648v38.106
				c-4.824,0.78-9.274,2.685-13.078,5.434L82.302,75.24C93.204,65.805,107.085,59.735,122.329,58.648z M75.313,82.217l26.955,26.954
				c-2.749,3.803-4.654,8.253-5.434,13.077h-38.18C59.761,106.996,65.853,93.113,75.313,82.217z M58.643,132.123h38.192
				c0.779,4.824,2.685,9.274,5.434,13.078l-27.029,27.029C65.788,161.308,59.714,147.398,58.643,132.123z M122.329,195.884
				c-15.285-1.09-29.197-7.188-40.113-16.666l27.035-27.035c3.804,2.749,8.254,4.654,13.078,5.434V195.884z M122.329,147.459v0.072
				c-2.131-0.518-4.131-1.36-5.953-2.474l0.047-0.047c-2.85-1.738-5.244-4.132-6.982-6.983l-0.046,0.046
				c-1.114-1.822-1.956-3.821-2.474-5.952h0.071c-0.385-1.585-0.611-3.233-0.611-4.937c0-1.704,0.227-3.352,0.611-4.937h-0.071
				c0.518-2.13,1.359-4.129,2.474-5.951l0.046,0.046c1.738-2.85,4.133-5.245,6.982-6.982l-0.047-0.047
				c1.822-1.114,3.822-1.957,5.953-2.474v0.072c1.586-0.385,3.233-0.612,4.938-0.612s3.352,0.227,4.938,0.612v-0.072
				c2.131,0.518,4.13,1.359,5.951,2.473l-0.047,0.047c2.851,1.737,5.245,4.132,6.983,6.982l0.046-0.046
				c1.115,1.822,1.957,3.822,2.475,5.953h-0.071c0.385,1.585,0.611,3.233,0.611,4.937c0,1.704-0.227,3.352-0.611,4.937h0.071
				c-0.518,2.131-1.359,4.131-2.475,5.953l-0.046-0.046c-1.738,2.85-4.133,5.244-6.983,6.982l0.047,0.046
				c-1.821,1.114-3.82,1.956-5.951,2.474v-0.072c-1.586,0.385-3.233,0.612-4.938,0.612S123.915,147.845,122.329,147.459z
				M132.204,195.884v-38.267c4.824-0.78,9.273-2.685,13.077-5.433l27.034,27.034C161.4,188.696,147.488,194.794,132.204,195.884z
				M179.292,172.23l-27.028-27.028c2.749-3.804,4.654-8.254,5.435-13.079h38.191C194.818,147.398,188.745,161.308,179.292,172.23z"
                id="rim"
              ></path>
            </g>
          </svg>
          <div className="road"></div>
        </div>
      </div>
    );
  }

  const handleLeave = async (communityId) => {
    try {
      await leaveCommunity(communityId, user.id);

      // Redirigir al usuario a la página de inicio
      navigate("/");
    } catch (err) {
      setError("Error leaving the community");
    }
  };

  return (
    <div className="bg-[url('../rider-1.jpg')] min-h-screen p-4 py-20">
      <div className="flex flex-col items-center justify-center gap-2 lg:gap-2">
        {/* Creador */}
        <div className="flex w-full  lg:w-2/4  justify-between items-center h-auto p-4 bg-white shadow-lg rounded-lg">
          <h2 className="sr-only">Creador</h2>
          <div
            className="flex flex-row gap-2 justify-center items-center cursor-pointer"
            onClick={() => navigate(`/profile/${communityMessages[0]?.sender}`)}
          >
            <img
              src={
                users[communityMessages[0]?.sender]?.data?.photo
                  ? `${users[communityMessages[0]?.sender]?.data?.photo}`
                  : "../default-image.jpg"
              }
              alt={users[communityMessages[0]?.sender]?.data?.fullName}
              className="rounded-full h-12  w-12 object-cover object-center mx-auto"
            />
            <p className="text-xl font-semibold">
              {users[communityMessages[0]?.sender]?.data?.role ===
                "premium" && (
                <FontAwesomeIcon
                  icon={faCrown}
                  className="mr-1 text-yellow-500"
                />
              )}
              {users[communityMessages[0]?.sender]?.data?.fullName}
            </p>
            <p>@{users[communityMessages[0]?.sender]?.data?.username}</p>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <SecondaryButton onClick={() => handleLeave(communityData._id)}>
              Abandonar Comunidad
            </SecondaryButton>
          </div>
        </div>

        {/* Comunidad */}
        <div className="w-full lg:w-2/4 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-center gap-4 mb-4 items-center">
            <img
              src={
                communityData.media
                  ? `${communityData.media}`
                  : "../default-image.jpg"
              }
              alt=""
              className="rounded-full h-12 w-12 object-cover object-center"
            />
            <h3 className="text-3xl font-bold text-gray-800 text-center">
              {communityData.name || "Cargando..."}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {communityData.members?.length} miembros
            </p>
          </div>

          {/* Mensajes */}
          <div>
            <div
              className="messages space-y-4 max-h-96 
             overflow-y-auto p-4 bg-gray-50 rounded-md shadow-inner"
            >
              {communityMessages.length > 0 ? (
                communityMessages.map((msg) => (
                  <div
                    key={msg._id || msg.timestamp}
                    className="message bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    onClick={() => navigate(`/profile/${msg.sender}`)}
                  >
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            users[msg.sender]?.data?.photo
                              ? `${users[msg.sender]?.data?.photo}`
                              : "../default-image.jpg"
                          }
                          alt=""
                          className="rounded-full h-8 w-8 object-cover object-center"
                        />
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">
                            {users[msg.sender]?.data?.role === "premium" && (
                              <FontAwesomeIcon
                                icon={faCrown}
                                className="mr-1 text-yellow-500"
                              />
                            )}
                            {users[msg.sender]?.data?.username ||
                              "Usuario desconocido"}
                          </span>{" "}
                          - {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-800">{msg.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No hay mensajes en este chat aún.
                </p>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Mostrar área de escritura si es el creador */}
          {communityData.creator &&
            user &&
            user.id === communityData.creator._id && (
              <div className="mt-6">
                <label htmlFor="message" className="sr-only">
                  Escribe un mensaje
                </label>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje aquí..."
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-2 p-2"
                  rows={3}
                />

                <SecondaryButton onClick={handleSendMessage}>
                  Enviar Mensaje
                </SecondaryButton>
              </div>
            )}

          {/* Mostrar errores */}
          {error && (
            <div className="mt-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
