import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getConversations } from "../../service/chat";
import { getUserByUsername } from "../../service/user";
import { useAuth } from "../../context/AuthContext";
import SecondaryButton from "../../components/Button/SecondaryButton";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MySwal = withReactContent(Swal);

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations(user.id);

        const filteredUsers = data.filter(
          (conversation) => conversation._id !== user?.id
        );
        setUsers(filteredUsers || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user?.id]);

  const handleSearchUser = async () => {
    const { value: username } = await MySwal.fire({
      title: "Buscar Usuario",
      input: "text",
      inputLabel: "Ingrese el nombre de usuario con el que desea chatear",
      inputPlaceholder: "Nombre de usuario",
      showCancelButton: true,
      confirmButtonText: "Buscar",
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#808080",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "El campo no puede estar vacío";
        }
      },
    });

    if (username) {
      try {
        const response = await getUserByUsername(username);
        const userProfile = response.data[0];

        if (userProfile) {
          const confirmed = await MySwal.fire({
            title: `¿Seleccionar a ${userProfile.fullName}?`,
            text: `@${userProfile.username}`,
            imageUrl: userProfile.photo
              ? `${userProfile.photo}`
              : "../default-image.jpg",
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: userProfile.fullName,
            showCancelButton: true,
            confirmButtonText: "Seleccionar",
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#808080",
            cancelButtonText: "Cancelar",
          });

          if (confirmed.isConfirmed) {
            onSelectUser(userProfile);

            MySwal.fire(
              "Éxito",
              `Usuario seleccionado: ${userProfile.fullName}`,
              "success"
            );

            setTimeout(() => {
              MySwal.close();
            }, 1000);

            setUsers((prev) => [...prev, userProfile]);
          }
        } else {
          MySwal.fire("No encontrado", "Usuario no encontrado.", "error");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        MySwal.fire(
          "Error",
          "Usuario no encontrado. Intente de nuevo más tarde.",
          "error"
        );
      }
    }
  };

  return (
    <div className="p-4">
      {/* Título y botón de búsqueda */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl sm:text-3xl font-bold">Chats</h3>
        <SecondaryButton onClick={handleSearchUser}>Crear Chat</SecondaryButton>
      </div>

      {/* Listado de conversaciones o mensaje de carga */}
      {loading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((conversation) => {
            const otherUser =
              conversation._id !== user.id ? conversation : null;

            console.log("Conversación: ", conversation);

            return (
              <li
                key={otherUser._id}
                className="p-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                onClick={() => otherUser && onSelectUser(otherUser)}
              >
                <div className="flex gap-2 items-center">
                  {/* Foto del usuario */}
                  <img
                    src={
                      otherUser.photo
                        ? `${otherUser.photo}`
                        : "../default-image.jpg"
                    }
                    alt={otherUser.fullName || "Usuario"}
                    className="w-10 h-10 rounded-full object-cover object-center"
                  />

                  {/* Nombre y usuario */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-1">
                      {otherUser.role === "premium" && (
                        <FontAwesomeIcon
                          icon={faCrown}
                          className="text-yellow-500"
                        />
                      )}
                      {otherUser.fullName || "Usuario"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      @{otherUser.username || "Desconocido"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No tienes conversaciones activas.</p>
      )}
    </div>
  );
};
UserList.propTypes = {
  onSelectUser: PropTypes.func.isRequired,
};

export default UserList;
