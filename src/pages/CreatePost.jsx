import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Asegúrate de que esta ruta sea correcta
import { createPost, getPostsByUserId } from "../service/post"; // Importar la función createPost
import SecondaryButton from "../components/Button/SecondaryButton";
import Swal from "sweetalert2";

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

const CreatePost = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(""); // Cambia a "" para manejar el nuevo estado
  const [category, setCategory] = useState("motos");
  const [taggedUsers, setTaggedUsers] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    const fetchPosts = async () => {
      try {
        const response = await getPostsByUserId(user.id);
        console.log(response);
        setPosts(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "description":
        setDescription(value);
        break;
      case "taggedUsers":
        setTaggedUsers(value);
        break;
      default:
        break;
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value); // Cambiado para manejar la nueva entrada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (user.role === "user") {
      if (posts.length >= 10) {
        const result = await Swal.fire({
          title: "Has alcanzado el límite de eventos",
          text: "Hazte premium para crear más eventos",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Hazte premium",
          cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
          try {
            navigate("/premium");
          } catch (err) {
            console.error(err);
            setError("Error al redirigir a la página de premium");
          }
        }

        setError("Has alcanzado el límite de eventos");
        setLoading(false);
        return;
      }
    }

    if (!media) {
      setError("Debes seleccionar una imagen o video");
      setLoading(false);
      return;
    }

    if (!description) {
      setError("Debes ingresar una descripción");
      setLoading(false);
      return;
    }

    if (!location) {
      setError("Debes ingresar una ubicación");
      setLoading(false);
      return;
    }

    if (!category) {
      setError("Debes seleccionar una categoría");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (media) formData.append("media", media);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);

    const taggedUsersArray = taggedUsers
      .split(",")
      .map((user) => user.trim())
      .filter((user) => user);
    if (taggedUsersArray.length > 0) {
      formData.append("taggedUsers", JSON.stringify(taggedUsersArray));
    }

    try {
      await createPost(formData);
      setMedia(null);
      setDescription("");
      setLocation("");
      setCategory("motos");
      setTaggedUsers("");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Error al crear la publicación";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] px-4 pt-20">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
        {/* Contenedor de Media */}
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Crear Publicación
          </h1>
          {media ? (
            media.type.includes("image") ? (
              <img
                src={URL.createObjectURL(media)}
                alt="Vista previa"
                className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700 object-cover object-center"
              />
            ) : (
              <video controls className="w-full h-auto rounded-lg">
                <source src={URL.createObjectURL(media)} type={media.type} />
              </video>
            )
          ) : (
            <div className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700">
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
              onChange={handleMediaChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
        </div>

        {/* Formulario */}
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
              id="description"
              value={description}
              onChange={handleInputChange}
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
              Ubicación (Barrio o Provincia)
            </label>
            <select
              id="location"
              value={location}
              onChange={handleLocationChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="" disabled>
                Seleccionar ubicación
              </option>
              {barriosBuenosAires.map((barrio, index) => (
                <option key={index} value={barrio}>
                  {barrio}
                </option>
              ))}
              {provinciasArgentina.map((provincia, index) => (
                <option
                  key={index + barriosBuenosAires.length}
                  value={provincia}
                >
                  {provincia}
                </option>
              ))}
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
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="motos">Motos</option>
              <option value="accesorios">Accesorios</option>
              <option value="rutas">Rutas</option>
              <option value="eventos">Eventos</option>
              <option value="comunidad">Comunidad</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <SecondaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear Publicación"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
