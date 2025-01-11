import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/Button/SecondaryButton";
import { register } from "../service/auth";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realTimeError, setRealTimeError] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const navigate = useNavigate();

  // Handler para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación en tiempo real para username
    if (name === "username") {
      // Reemplazar espacios y permitir solo . y -
      let newValue = value.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
      setFormData({ ...formData, [name]: newValue });

      // Validación en tiempo real para el campo de username
      if (/[^a-zA-Z0-9.-]/.test(value)) {
        setRealTimeError({
          ...realTimeError,
          username:
            "El nombre de usuario solo puede contener letras, números, puntos (.) y guiones (-).",
        });
      } else {
        setRealTimeError({ ...realTimeError, username: "" });
      }
    } else if (name === "email") {
      setFormData({ ...formData, [name]: value });

      // Validación de email en tiempo real
      if (!validateEmail(value)) {
        setRealTimeError({
          ...realTimeError,
          email: "El correo electrónico no tiene un formato válido.",
        });
      } else {
        setRealTimeError({ ...realTimeError, email: "" });
      }
    } else if (name === "password") {
      setFormData({ ...formData, [name]: value });

      // Validación de contraseña en tiempo real
      if (!validatePassword(value)) {
        setRealTimeError({
          ...realTimeError,
          password:
            "La contraseña debe tener al menos 8 caracteres, con al menos una letra y un número.",
        });
      } else {
        setRealTimeError({ ...realTimeError, password: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validación de correo electrónico
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Validación de contraseña (mínimo 8 caracteres, con al menos una letra y un número)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar campos requeridos
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.fullName
    ) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    // Validar formato del correo
    if (!validateEmail(formData.email)) {
      setError("El correo electrónico no tiene un formato válido.");
      setLoading(false);
      return;
    }

    // Validar contraseña
    if (!validatePassword(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, con al menos una letra y un número."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error al registrar el usuario. Intenta nuevamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('../bg-login-1.jpeg')] bg-cover bg-center">
      <div className="bg-gray-200/80 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-md transition-transform duration-300 transform">
        <div className="flex justify-center mb-4">
          <img
            src="../ridehub-logo-1.png"
            alt="RideHub Logo"
            className="w-32 sm:w-36 animate-bounce-slow"
          />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Nombre Completo */}
          <div className="block mb-4 relative">
            <label className="sr-only" htmlFor="fullName">
              Nombre Completo
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              placeholder="Nombre Completo"
            />
          </div>
          {/* Nombre de Usuario */}
          <div className="block mb-4 relative">
            <label className="sr-only" htmlFor="username">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              placeholder="Nombre de Usuario"
              autoComplete="off"
            />
            {realTimeError.username && (
              <p className="text-red-500 text-xs">{realTimeError.username}</p>
            )}
          </div>
          {/* Correo Electrónico */}

          <div className="block mb-4 relative">
            <label className="sr-only" htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              placeholder="Correo Electrónico"
              autoComplete="off"
            />
            {realTimeError.email && (
              <p className="text-red-500 text-xs">{realTimeError.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="block mb-4 relative">
            <label className="sr-only" htmlFor="password">
              contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              placeholder="Contraseña"
              autoComplete="off"
            />
            {realTimeError.password && (
              <p className="text-red-500 text-xs">{realTimeError.password}</p>
            )}
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="flex justify-center">
            <SecondaryButton type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </SecondaryButton>
          </div>
        </form>

        <div className="mt-2 text-center">
          <p className="text-xs sm:text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
