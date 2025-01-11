import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`max-w-xs p-2 rounded-md ${
            message.sender === "user_id"
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-300 text-gray-800 self-start"
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
