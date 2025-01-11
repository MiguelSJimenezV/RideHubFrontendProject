import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../service/post";
import SecondaryButton from "../components/Button/SecondaryButton";

const barriosBuenosAires = [
  "Abasto",
  "Almagro",
  "Balvanera",
  "Barracas",
  "Belgrano",
  "Boca",
  "Caballito",
  "Chacarita",
  "Congreso",
  "Flores",
  "Floresta",
  "La Boca",
  "Liniers",
  "Palermo",
  "Recoleta",
  "Retiro",
  "San Telmo",
  "Villa Devoto",
  "Villa Luro",
  "Villa Urquiza",
  "Villa del Parque",
];

const provinciasArgentina = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const categorias = [
  "Motos",
  "Accesorios",
  "Rutas",
  "Eventos",
  "Comunidad",
  "Otros",
];

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    description: "",
    location: "",
    category: "",
    media: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPostData(response);
      } catch (err) {
        console.error(err);
        setError("Error al obtener la publicación.");
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPostData((prevData) => ({
        ...prevData,
        media: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("description", postData.description);
    formData.append("location", postData.location);
    formData.append("category", postData.category);
    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    try {
      await updatePost(id, formData);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Editar Publicación
          </h1>

          {postData.media || selectedFile ? (
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile) // Imagen seleccionada
                  : `${postData.media}` // Imagen del servidor
              }
              alt="Vista previa"
              className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700 object-cover object-center"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mx-auto">
              Selecciona una imagen o video
            </div>
          )}
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
              onChange={handleFileChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full p-6 space-y-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              value={postData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              rows="4"
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2"
            >
              Ubicación
            </label>
            <select
              name="location"
              id="location"
              value={postData.location}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="" disabled>
                Seleccionar ubicación
              </option>
              {[...barriosBuenosAires, ...provinciasArgentina].map(
                (loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-bold mb-2"
            >
              Categoría
            </label>
            <select
              name="category"
              id="category"
              value={postData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <SecondaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar Publicación"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
