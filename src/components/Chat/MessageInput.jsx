import React from "react";

const MessageInput = ({ value, onChange, onSend }) => {
  return (
    <div className=" flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Escribe un mensaje..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={onSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};

export default MessageInput;
