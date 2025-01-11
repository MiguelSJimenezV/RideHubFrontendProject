import React, { useEffect, useState } from "react";
import { getAllCommunities, joinCommunity } from "../../service/community";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SecondaryButton from "../../components/Button/SecondaryButton";
import Swal from "sweetalert2";

const AllCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getAllCommunities();
        const updatedData = data.map((community) => ({
          ...community,
          isMember:
            community.members.findIndex((member) => member._id === user.id) !==
            -1,
        }));
        console.log(data);
        console.log(updatedData);
        setCommunities(updatedData);
      } catch (err) {
        setError("Error fetching communities");
      }
    };

    if (user?.id) {
      fetchCommunities();
    }
  }, [user]);

  // Backend: Controller de joinCommunity
  const handleShowCommunity = async (id) => {
    // Verificar si el usuario tiene rol de "user"
    if (user.role === "user") {
      Swal.fire({
        title: "Has descubierto una funcionalidad premium",
        text: "Hazte premium para unirte a las comunidades",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Hazte premium",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/premium");
        }
      });
      return;
    }

    // Verificar si ya es miembro de la comunidad
    const community = communities.find((c) => c._id === id);
    if (community?.isMember) {
      navigate(`/communities/${id}`);
      return;
    }

    // Intentar unirse a la comunidad
    try {
      const response = await joinCommunity(id, user.id);

      console.log(response.data);
      if (response.data?.message === "User already a member") {
        console.log("Ya eres miembro de esta comunidad.");
      } else if (response.data?.message === "User joined successfully") {
        console.log("Te has unido a la comunidad con éxito.");
      }
      navigate(`/communities/${id}`);
    } catch (err) {
      console.log(err);
      // Manejar errores del servidor o de la conexión
      const errorMessage =
        err.response?.data?.message ||
        "Ocurrió un error al unirte a la comunidad";
      setError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex flex-col max-w-screen-lg w-full bg-white shadow-md rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4">Comunidades</h1>
        <p className="text-gray-700 mb-4">
          Explora y únete a las comunidades que más te interesen. Aquí
          encontrarás grupos con personas con intereses similares, donde podrás
          mantenerte informado acerca de próximos eventos, obtener conocimientos
          y mucho más.
        </p>

        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communities.map((community) => (
            <div
              key={community._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:cursor-pointer mb-4"
              onClick={() => handleShowCommunity(community._id)}
            >
              <img
                src={
                  community.media
                    ? `${community.media}`
                    : "https://via.placeholder.com/400x200"
                }
                alt={community.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{community.name}</h3>
                <p className="text-gray-700 mt-2">{community.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {community.members.length} miembros
                </p>
              </div>
              <div className="p-4 flex justify-between">
                <SecondaryButton
                  onClick={() => handleShowCommunity(community._id)}
                  className="hover:bg-blue-600 hover:text-white"
                >
                  {community.isMember ? "Ver Comunidad" : "Unirse"}
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCommunities;
