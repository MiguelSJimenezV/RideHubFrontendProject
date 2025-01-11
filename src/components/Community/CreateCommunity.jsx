import React, { useState } from "react";
import { createCommunity } from "../../service/community";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../components/Button/SecondaryButton";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Maneja el envío del formulario

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (media) {
      formData.append("media", media); // Añadir archivo al FormData
    }
    formData.append("creator", user.id);

    try {
      const community = await createCommunity(formData); // Cambiar para aceptar FormData
      console.log("Community created:", community);
      navigate(`/communities/`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center  bg-[url('../rider-1.jpg')]  p-4 pt-20">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
        {/* Contenedor de Media */}
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Crear Comunidad
          </h1>
          <div className=" h-full pb-10 flex justify-center items-center">
            {media ? (
              media.type.includes("image") ? (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Vista previa"
                  className="bg-gray-300 w-64 h-64 rounded-full object-cover object-center"
                />
              ) : (
                <video controls className="w-full h-auto rounded-lg">
                  <source src={URL.createObjectURL(media)} type={media.type} />
                </video>
              )
            ) : (
              <div className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700">
                Selecciona una imagen de portada
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
            {loading ? "Cargando..." : "Crear Comunidad"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
