import React, { useState, useEffect } from "react";
import { updateCommunity, getCommunityById } from "../../service/community";

import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import SecondaryButton from "../Button/SecondaryButton";

const UpdateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [existingMedia, setExistingMedia] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { communityId } = useParams();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const community = await getCommunityById(communityId);
        setName(community.name);
        setDescription(community.description);
        setExistingMedia(community.media);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCommunity();
  }, [communityId]);

  // Maneja cambios en el archivo subido
  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "description") setDescription(value);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    console.log("Community ID:", communityId);
    console.log("Name:", name);
    console.log("Description:", description);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (media) {
      formData.append("media", media); // Añadir archivo al FormData
    }
    formData.append("creator", user.id);

    console.log("Form data:", formData);

    try {
      const community = await updateCommunity(communityId, formData);
      console.log("Community Updated:", community);
      navigate(`/communities/`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center  bg-[url('../rider-1.jpg')]  p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
        {/* Contenedor de Media */}
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Editar Comunidad
          </h1>
          <div className=" h-full pb-10 flex justify-center items-center">
            {media ? (
              <img
                src={URL.createObjectURL(media)}
                alt="Vista previa"
                className="w-full h-auto rounded-lg"
              />
            ) : existingMedia ? (
              <img
                src={`${existingMedia}`}
                alt="Evento"
                className="bg-gray-300 w-64 h-64 rounded-full object-cover object-center"
              />
            ) : (
              <div className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700">
                Sin imagen seleccionada
              </div>
            )}
          </div>
        </div>

        {/* Formulario */}
        <div className="md:w-1/2 w-full p-6 space-y-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mt-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="media"
            >
              Imagen o Video
            </label>
            <input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Nombre de la Comunidad
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
              rows="4"
              required
            />
          </div>

          <SecondaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar Comunidad"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default UpdateCommunity;
