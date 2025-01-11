import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateEvent, getEventById } from "../service/events";
import SecondaryButton from "../components/Button/SecondaryButton";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const EventUpdate = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Rally");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [existingImage, setExistingImage] = useState(null);
  const [location, setLocation] = useState("");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Tu token de acceso de Mapbox
  const mapboxToken =
    "pk.eyJ1IjoibWlndWVsamltZW5leiIsImEiOiJjbTNtYm1zZzUxMDJhMmpwcm51b3hna2RkIn0.9QKStVrjBehwt8j5GbyGig";
  const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: value,
            limit: 5, // Limitar el número de resultados
          })
          .send();

        setSuggestions(response.body.features);
      } catch (error) {
        console.error("Error al obtener sugerencias de direcciones:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.place_name);
    setSuggestions([]);
    setSelectedLocation(suggestion);
  };

  // Imagen ya cargada

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Cargar los datos del evento existente
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id);
        setTitle(event.data.title);
        setDescription(event.data.description);
        setDate(event.data.date ? event.data.date.slice(0, 10) : "");
        setLocation(event.data.location);
        setExistingImage(event.data.image);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el evento");
      }
    };

    fetchEvent();
  }, [isAuthenticated, navigate, id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);

      if (selectedLocation) {
        formData.append("location", selectedLocation.place_name);
        formData.append("latitude", selectedLocation.center[1]);
        formData.append("longitude", selectedLocation.center[0]);
      } else if (location) {
        formData.append("location", location);
      } else {
        throw new Error("La ubicación es obligatoria.");
      }

      formData.append("category", category);
      if (image) {
        formData.append("image", image);
      }

      await updateEvent(id, formData);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el evento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] px-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4 mt-16">
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Editar Evento
          </h1>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Vista previa"
              className="w-full h-auto rounded-lg"
            />
          ) : existingImage ? (
            <img
              src={`${existingImage}`}
              alt="Evento"
              className="w-full h-60   object-cover object-center rounded-lg"
            />
          ) : (
            <div className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700">
              Sin imagen seleccionada
            </div>
          )}
          <div className="mt-4 mb-1.5">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="image"
            >
              Cambiar Imagen
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Título
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
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
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              rows="4"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-gray-700 font-bold mb-2"
            >
              Fecha
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
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
            <input
              type="text"
              id="location"
              value={query} // Asegúrate de que el valor venga del estado
              onChange={handleInputChange}
              placeholder="Escribe una ubicación"
              className="border border-gray-300 rounded p-2 w-full"
            />

            {/* Mostrar sugerencias */}
            {suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded mt-2">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSelect(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}

            {/* Mostrar ubicación seleccionada */}
            {selectedLocation && (
              <div className="mt-4">
                <strong>Ubicación seleccionada:</strong>
                <p>{selectedLocation.place_name}</p>
              </div>
            )}
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
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="Rally">Rally</option>
              <option value="Encuentro">Encuentro</option>
              <option value="Competencia">Competencia</option>
              <option value="Exhibición">Exhibición</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <SecondaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar Evento"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default EventUpdate;
