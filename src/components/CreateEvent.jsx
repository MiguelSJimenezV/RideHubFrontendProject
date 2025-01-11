import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Asegúrate de que esta ruta sea correcta
import { createEvent } from "../service/events";
import { getEventsByUserId } from "../service/events";
import Swal from "sweetalert2";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import SecondaryButton from "../components/Button/SecondaryButton";

const CreateEvent = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Rally");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    const fetchEvents = async () => {
      try {
        const response = await getEventsByUserId(user.id);
        setEvents(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log(user);

    if (user.role === "user") {
      if (events.length >= 1) {
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

    if (!title || !description || !date || !selectedLocation) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", selectedLocation.place_name);
    formData.append("category", category);
    formData.append("latitude", selectedLocation.center[1]);
    formData.append("longitude", selectedLocation.center[0]);
    if (image) {
      formData.append("image", image);
    }

    try {
      await createEvent(formData);
      setTitle("");
      setDescription("");
      setDate("");
      setSelectedLocation(null);
      setImage(null);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Error al crear el evento";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Tu token de acceso de Mapbox
  const mapboxToken =
    "pk.eyJ1IjoibWlndWVsamltZW5leiIsImEiOiJjbTNtYm1zZzUxMDJhMmpwcm51b3hna2RkIn0.9QKStVrjBehwt8j5GbyGig";
  const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

  // Manejar cambios en el campo de entrada
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

  // Seleccionar una ubicación
  const handleSelect = (location) => {
    setSelectedLocation(location);
    setQuery(location.place_name);
    setSuggestions([]);
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] px-4  pt-20 ">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4 ">
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Crear Evento
          </h1>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Vista previa"
              className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700 object-cover object-center"
            />
          ) : (
            <div className="bg-gray-300 w-full h-64 rounded-lg flex items-center justify-center text-gray-700">
              Selecciona una imagen
            </div>
          )}
          <div className="mt-4 mb-1.5">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="image"
            >
              Imagen
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
              value={query}
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
            {loading ? "Cargando..." : "Crear Evento"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
