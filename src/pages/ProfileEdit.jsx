import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../service/auth";
import SecondaryButton from "../components/Button/SecondaryButton";
const ProfileEdit = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    location: "",
    bikeDetails: {
      brand: "",
      model: "",
      year: "",
      licensePlate: "",
    },
    photo: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const neighborhoods = [
    "Almagro",
    "Balvanera",
    "Barracas",
    "Belgrano",
    "Boedo",
    "Caballito",
    "Chacarita",
    "Congreso",
    "Flores",
    "Floresta",
    "La Boca",
    "Liniers",
    "Palermo",
    "Recoleta",
    "San Telmo",
    "Villa Devoto",
    "Villa del Parque",
    "Villa Luro",
    "Villa Urquiza",
  ];

  const bikeBrandsAndModels = [
    { brand: "Honda", models: ["CBR", "CB", "CRF"] },
    { brand: "Yamaha", models: ["YZF", "MT", "FZ"] },
    { brand: "Kawasaki", models: ["Ninja", "Z", "Versys"] },
    { brand: "Suzuki", models: ["GSX", "V-Strom", "Burgman"] },
    { brand: "Ducati", models: ["Panigale", "Monster", "Multistrada"] },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          fullName: response.data.fullName || "",
          bio: response.data.bio || "",
          location: response.data.location || "",
          bikeDetails: response.data.bikeDetails || {
            brand: "",
            model: "",
            year: "",
            licensePlate: "",
          },
          photo: response.data.photo || "",
        });
      } catch (err) {
        console.log(err);
        setError("Error al cargar el perfil.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
    };
  }, [selectedFile]);

  const handleBikeDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      bikeDetails: {
        ...prevData.bikeDetails,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prevData) => ({
        ...prevData,
        media: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("username", formData.username);
    dataToSend.append("email", formData.email);
    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("bio", formData.bio);
    dataToSend.append("location", formData.location);

    // Campos de bikeDetails
    dataToSend.append("bikeDetails[brand]", formData.bikeDetails.brand);
    dataToSend.append("bikeDetails[model]", formData.bikeDetails.model);
    dataToSend.append("bikeDetails[year]", formData.bikeDetails.year);
    dataToSend.append(
      "bikeDetails[licensePlate]",
      formData.bikeDetails.licensePlate
    );

    // Archivo de foto (si existe)
    if (selectedFile) {
      dataToSend.append("photo", selectedFile);
    }

    if (formData.photo) {
      dataToSend.append("photo", formData.photo);
    }

    if (!formData.username || !formData.email || !formData.fullName) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!formData.location) {
      setError("Por favor selecciona una ubicación.");
      return;
    }

    if (!formData.bikeDetails.brand || !formData.bikeDetails.model) {
      setError("Por favor selecciona una marca y modelo de moto.");
      return;
    }

    if (!formData.bikeDetails.year) {
      setError("Por favor ingresa el año de la moto.");
      return;
    }

    if (!formData.bikeDetails.licensePlate) {
      setError("Por favor ingresa la matrícula de la moto.");
      return;
    }

    if (formData.bikeDetails.year < 1900 || formData.bikeDetails.year > 2025) {
      setError("Por favor ingresa un año válido.");
      return;
    }

    if (formData.bikeDetails.licensePlate.length < 6) {
      setError("Por favor ingresa una matrícula válida.");
      return;
    }

    if (formData.bikeDetails.licensePlate.length > 10) {
      setError("La matrícula no puede tener más de 10 caracteres.");
      return;
    }

    try {
      const response = await updateProfile(dataToSend);
      setSuccess("Perfil actualizado exitosamente.");
      navigate("/profile");
    } catch (err) {
      console.error("Error en la actualización:", err.response?.data || err);
      setError("Error al actualizar el perfil.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('../rider-1.jpg')] p-4 mt-16">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4"
      >
        <div className="md:w-1/2 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Editar Perfil
          </h1>
          {formData.photo || selectedFile ? (
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile) // Imagen seleccionada
                  : `${formData.photo}` // Imagen del servidor
              }
              alt="Vista previa"
              className="w-48 h-48 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mx-auto">
              Sin imagen
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

          <div className="mt-4">
            <label
              htmlFor="fullName"
              className="lock text-gray-700 font-bold mb-2"
            >
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="username"
              className="lock text-gray-700 font-bold mb-2"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="off"
              value={formData.username || ""}
              onChange={handleChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="email"
              className="lock text-gray-700 font-bold mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email || ""}
              onChange={handleChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              required
            />
          </div>
        </div>

        <div className="md:w-1/2 w-full p-6 space-y-4">
          {error && <p className="text-red-500 mb-4 col-span-2">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4 col-span-2">{success}</p>
          )}

          <div className="mt-4">
            <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
              Biografía
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2"
            >
              Ubicación
            </label>
            <select
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            >
              <option value="">Seleccionar ubicación</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="brand"
              className="block text-gray-700 font-bold mb-2"
            >
              Marca de Moto
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.bikeDetails.brand || ""}
              onChange={handleBikeDetailsChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            >
              <option value="">Seleccionar marca</option>
              {bikeBrandsAndModels.map((bike) => (
                <option key={bike.brand} value={bike.brand}>
                  {bike.brand}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="model"
              className="block text-gray-700 font-bold mb-2"
            >
              Modelo de Moto
            </label>
            <select
              id="model"
              name="model"
              value={formData.bikeDetails.model || ""}
              onChange={handleBikeDetailsChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            >
              <option value="">Seleccionar modelo</option>
              {bikeBrandsAndModels
                .find((bike) => bike.brand === formData.bikeDetails.brand)
                ?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="year"
              className="block text-gray-700 font-bold mb-2"
            >
              Año de Moto
            </label>
            <input
              id="year"
              type="text"
              name="year"
              value={formData.bikeDetails.year || ""}
              onChange={handleBikeDetailsChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="licensePlate"
              className="block text-gray-700 font-bold mb-2"
            >
              Matrícula
            </label>
            <input
              id="licensePlate"
              type="text"
              name="licensePlate"
              value={formData.bikeDetails.licensePlate || ""}
              onChange={handleBikeDetailsChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>

          <SecondaryButton type="submit">Actualizar Perfil</SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
