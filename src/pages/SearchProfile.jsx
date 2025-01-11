// src/components/SearchProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername, getAllUsers } from "../service/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const SearchProfile = () => {
  const [username, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        try {
          const response = await getUserByUsername(username);
          setUserProfile(response.data[0]);
          console.log(response.data[0]);
          setError(""); // Resetea el error
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setError("No se encontraron usuarios relacionados");
        }
      } else {
        setUserProfile(null); // Limpia el perfil si el input está vacío
      }
    };

    const timeoutId = setTimeout(fetchUserProfile, 300); // Espera 300ms antes de buscar
    return () => clearTimeout(timeoutId); // Limpia el timeout si el componente se desmonta o si username cambia
  }, [username]);

  const handleProfileClick = () => {
    if (userProfile) {
      navigate(`/profile/${userProfile._id}`); // Cambia esto a la ruta de perfil correcto
    }
  };

  return (
    <div className="flex justify-center items-center p-4  bg-[url('../rider-1.jpg')] min-h-screen mt-12">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
        <div className=" w-full mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Buscar Perfil de Usuario
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <label htmlFor="username" className="sr-only">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese el nombre de usuario"
              required
              autoComplete="off"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </form>

          {error && <p className="text-red-600">{error}</p>}

          {userProfile && (
            <div
              className="user-profile bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4 cursor-pointer"
              onClick={handleProfileClick}
            >
              <div className="flex justify-start items-center gap-2">
                <img
                  src={
                    userProfile.photo
                      ? `${userProfile.photo}`
                      : "../default-image.jpg"
                  }
                  alt={userProfile.fullName}
                  className="w-12 h-12 rounded-full object-cover object-center"
                />
                <div className="py-2">
                  <h3 className="text-lg font-semibold">
                    {userProfile.role === "premium" && (
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-yellow-500 mr-2"
                      />
                    )}
                    {userProfile.fullName}
                  </h3>
                  <p className="text-gray-600">@{userProfile.username}</p>
                </div>
              </div>
              {/* Agrega más información que consideres necesaria */}
            </div>
          )}

          <h2 className="text-xl font-bold mb-2">Usuarios Aleatorios</h2>
          <div className="random-users grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allUsers
              .sort(() => Math.random() - Math.random()) // Mezcla los usuarios
              .slice(0, 6) // Muestra solo 5 usuarios
              .map((user) => (
                <div
                  key={user._id}
                  className="random-user bg-gray-100 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition duration-300"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <div className="flex justify-start items-center gap-2">
                    <img
                      src={
                        user.photo ? `${user.photo}` : "../default-image.jpg"
                      }
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover object-center"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.role === "premium" && (
                          <FontAwesomeIcon
                            icon={faCrown}
                            className="text-yellow-500 mr-2"
                          />
                        )}
                        {user.fullName}
                      </h3>
                      <p className="text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;
