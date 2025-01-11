import React, { useState } from "react";
import Chat from "../components/Chat/Chat";
import UserList from "../components/Chat/UserList";

const ChatView = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen pt-20 bg-cover bg-center">
      <div className="w-full max-w-screen-lg bg-white shadow-md rounded-lg p-4 h-full">
        <div className="flex flex-col-reverse md:flex-row h-full">
          {/* Lista de usuarios */}
          <div className="w-full md:w-1/3 border-gray-300 bg-white md:border-r md:overflow-y-auto">
            <UserList onSelectUser={setSelectedUser} />
          </div>

          {/* Área del chat */}
          <div className="flex-1 h-full   md:h-full overflow-y-auto">
            {selectedUser ? (
              <Chat selectedUser={selectedUser} />
            ) : (
              <div className="h-full p-5 bg-gray-100 flex justify-center items-center rounded-lg">
                <p className="text-gray-500 text-center text-sm sm:text-base">
                  Selecciona un usuario para chatear.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
