import { useState } from "react";
import SecondaryButton from "../Button/SecondaryButton";
import { useAuth } from "../../context/AuthContext";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { useNavigate } from "react-router-dom";
import { updateRole } from "../../service/auth";

const Premium = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [payment, setPayment] = useState("Tarjeta de crédito");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
            limit: 5,
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

  const handleSelect = (location) => {
    setSelectedLocation(location);
    setQuery(location.place_name);
    setSuggestions([]);
  };

  const validateCardNumber = (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
  };

  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    return regex.test(date);
  };

  const validateCVV = (cvv) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!validateCardNumber(card)) {
      setError("El número de tarjeta debe tener exactamente 16 dígitos.");
      setLoading(false);
      return;
    }

    if (!validateExpiryDate(expiry)) {
      setError("La fecha de expiración debe tener el formato MM/AA.");
      setLoading(false);
      return;
    }

    if (!validateCVV(cvv)) {
      setError("El CVV debe tener 3 o 4 dígitos.");
      setLoading(false);
      return;
    }

    if (!selectedLocation) {
      setError("Debes seleccionar una ubicación válida.");
      setLoading(false);
      return;
    }

    try {
      console.log("Datos enviados: ", {
        user,
        payment,
        card,
        expiry,
        cvv,
        location: selectedLocation,
      });

      // Simular petición a la API
      await updateRole(user.id, "premium");
      // Simular éxito
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);

      setTimeout(() => {
        navigate("/profile");
      }, 4000);
    } catch (err) {
      setError("Hubo un error al procesar tu solicitud. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] px-4 py-20   ">
      <div className="flex flex-col-reverse md:flex-row max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <div className="md:w-1/2 w-full p-6">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Acceso Premium
          </h1>
          <p className="text-gray-600 mb-6">
            Completa tus datos para desbloquear contenido exclusivo.
          </p>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && (
            <div className="text-green-500 mb-4">
              ¡Tu suscripción premium ha sido activada exitosamente!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="payment"
              >
                Método de pago
              </label>
              <select
                id="payment"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              >
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
                <option value="Paypal">Paypal</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                maxLength="16"
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                  placeholder="MM/AA"
                  maxLength="5"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                  maxLength="4"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Escribe una ubicación"
                className="border border-gray-300 rounded p-2 w-full"
              />
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
              {selectedLocation && (
                <div className="mt-2 text-gray-600">
                  Ubicación seleccionada: {selectedLocation.place_name}
                </div>
              )}
            </div>

            <SecondaryButton type="submit" disabled={loading}>
              {loading ? "Procesando..." : "Suscribirme"}
            </SecondaryButton>
          </form>
        </div>
        <div className="md:w-1/2 w-full p-6 space-y-6">
          {/* Usuario Free */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <i className="fas fa-user text-gray-600 mr-2"></i> Usuario Free
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i> Creación de
                <strong className="ml-1">1 evento</strong>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i> Hasta{" "}
                <strong className="ml-1">10 publicaciones</strong>
              </li>
              <li className="flex items-center">
                <i className="fas fa-times text-red-500 mr-2"></i> Sin acceso a{" "}
                <strong className="ml-1">comunidades</strong>
              </li>
            </ul>
          </div>

          {/* Usuario Premium */}
          <div className="border border-yellow-400 rounded-lg p-4 bg-yellow-50 shadow-sm">
            <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center justify-center">
              <i className="fas fa-crown text-yellow-500 mr-2"></i> Usuario
              Premium
            </h2>
            <ul className="space-y-3 text-yellow-700">
              <li className="flex items-center">
                <i className="fas fa-star text-yellow-500 mr-2"></i> Creación de{" "}
                <strong className="ml-1">eventos ilimitados</strong>
              </li>
              <li className="flex items-center">
                <i className="fas fa-star text-yellow-500 mr-2"></i>{" "}
                Publicaciones <strong className="ml-1">ilimitadas</strong>
              </li>
              <li className="flex items-center">
                <i className="fas fa-star text-yellow-500 mr-2"></i> Creación de{" "}
                <strong className="ml-1">comunidades ilimitadas</strong>
              </li>
            </ul>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-yellow-800">
                Costo: <span className="text-2xl">$9.99 USD</span>/mes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
