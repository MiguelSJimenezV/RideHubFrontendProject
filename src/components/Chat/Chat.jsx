import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getMessages,
  getOrCreateConversation,
  sendMessage,
  getConversations,
} from "../../service/chat";
import { useAuth } from "../../context/AuthContext";
import SecondaryButton from "../Button/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const API_URL = import.meta.env.VITE_API_URL;

const Chat = ({ selectedUser }) => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageRef] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversation = await getOrCreateConversation(
          user.id,
          selectedUser._id
        );

        setConversationId(conversation._id);

        const fetchedMessages = await getMessages(conversation._id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [selectedUser, user.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        conversationId,
        sender: user.id,
        receiver: selectedUser._id,
        content: newMessage,
      };

      await getConversations(user.id);
      await sendMessage(message);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="bg-slate-800 text-white px-6 py-4 rounded-t-lg flex items-center">
        <div
          onClick={() => navigate(`/profile/${selectedUser._id}`)}
          className="flex items-center space-x-4"
        >
          <div className="bg-blue-400 h-10 w-10 flex items-center justify-center rounded-full">
            <img
              src={
                selectedUser.photo
                  ? `${selectedUser.photo}`
                  : "../default-image.jpg"
              }
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-full object-cover object-center"
            />
          </div>
          <h3 className="text-lg font-semibold">
            <span
              className="hover:underline hover:cursor-pointer"
              onClick={() => navigate(`/profile/${selectedUser._id}`)}
            >
              {selectedUser.role === "premium" ? (
                <span className="text-yellow-500">
                  <FontAwesomeIcon icon={faCrown} className="mr-1" />
                </span>
              ) : null}
              {selectedUser.fullName}
            </span>
            <span className="ml-1 font-normal">@{selectedUser.username}</span>
          </h3>
        </div>
      </div>

      {/* Message Area */}
      <div className="max-h-96 min-h-96 flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.length === 0 && (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-center">No hay mensajes.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.sender === user.id
                  ? "bg-slate-800 text-white"
                  : "bg-gray-400 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageRef}></div>
      </div>

      {/* Input Area */}
      <div className="flex flex-col md:flex-row justify-center items-center p-4 border-t gap-4 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <SecondaryButton
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Enviar
        </SecondaryButton>
      </div>
    </div>
  );
};

Chat.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    photo: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default Chat;
