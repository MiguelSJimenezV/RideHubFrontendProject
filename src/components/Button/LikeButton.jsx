import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ onClick = () => {}, children, disabled = false }) => {
  const [liked, setLiked] = useState(false); // Estado para manejar si está likedo o no

  const handleClick = () => {
    setLiked((prev) => !prev); // Alterna el estado de "liked"
    onClick(); // Ejecuta la función pasada como prop (si existe)
  };

  return (
    <button
      className={`flex items-center justify-between  py-2 px-4  rounded-full shadow-md hover:shadow-lg 
      transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900
        ${
          liked
            ? "bg-slate-800 hover:bg-slate-900"
            : "bg-slate-800 hover:bg-slate-900"
        } 
        disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="flex-grow text-center text-white font-medium">
        {children}
      </div>
      <div
        className={`bg-red-600 text-white rounded-full w-1 h-2 flex items-center justify-center ml-2 shadow-md p-3 hover:bg-red-800 transition duration-300
          ${liked ? " group-hover:bg-red-800" : "bg-red-600 hover:bg-red-800"}`}
      >
        <FontAwesomeIcon
          icon={liked ? faThumbsDown : faThumbsUp}
          className="text-white"
        />
      </div>
    </button>
  );
};

export default LikeButton;
