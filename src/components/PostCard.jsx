import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faThumbsUp,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = import.meta.env.VITE_API_URL;

const PostCard = ({
  creator = {}, // Valor por defecto
  createdAt, // Cambiado de updatedAt a createdAt
  description,
  media,
  category,
  location,
  likes = [], // Valor por defecto
  comments = [], // Valor por defecto
  onClick,
}) => {
  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",
    motos: "bg-red-200 text-red-800",
    accesorios: "bg-blue-200 text-blue-800",
    rutas: "bg-yellow-200 text-yellow-800",
    eventos: "bg-green-200 text-green-800",
    comunidad: "bg-slate-200 text-gray-800",
  };

  const formattedMedia = media ? media.replace(/\\/g, "/") : null;

  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-lg transition-shadow w-full"
    >
      <img
        src={formattedMedia ? `${formattedMedia}` : "../default-image.jpg"}
        alt={creator?.username || "Imagen no disponible"}
        className="w-full h-48 object-cover"
      />

      <div className="w-full p-4">
        <div>
          <div className="flex items-center ">
            <img
              src={`${creator?.photo}`}
              alt={creator?.username || "Imagen no disponible"}
              className="w-10 h-10 object-cover rounded-full"
            />
            <p className="font-semibold ml-2">
              {creator.role === "premium" && (
                <FontAwesomeIcon
                  icon={faCrown}
                  className="text-yellow-500 mr-1"
                />
              )}
              @{creator?.username || "Anónimo"}
            </p>
          </div>

          <p className="font-semibold mt-2">
            {description.length > 80
              ? `${description.substring(0, 80)}...`
              : description}
          </p>

          <p className="flex items-center text-gray-500 mt-1">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            {location || "Ubicación no disponible"}
          </p>

          {category && (
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                categoryStyles[category.toLowerCase()] || categoryStyles.otros
              }`}
            >
              {category}
            </span>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {createdAt
              ? new Date(createdAt).toLocaleDateString()
              : "Fecha no disponible"}
          </p>

          <div className="flex justify-between items-center mt-2 text-gray-500">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              {likes.length}
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2h-16c-1.104 0-2 0.896-2 2v16c0 1.104 0.896 2 2 2h8l4 4v-4h4c1.104 0 2-0.896 2-2v-16c0-1.104-0.896-2-2-2zm0 16h-5v3l-3-3h-8v-14h16v14zm-12-9h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2z" />
              </svg>
              {comments.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  creator: PropTypes.object,
  createdAt: PropTypes.string,
  description: PropTypes.string,
  media: PropTypes.string,
  category: PropTypes.string,
  location: PropTypes.string,
  likes: PropTypes.array, // Declarado correctamente
  comments: PropTypes.array, // Declarado correctamente
  onClick: PropTypes.func, // Nueva propiedad para manejar el clic
};

export default PostCard;
