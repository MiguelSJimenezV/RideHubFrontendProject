import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/auth";
import { useAuth } from "../context/AuthContext";
import SecondaryButton from "../components/Button/SecondaryButton";

const Login = () => {
  const { login: updateAuthContext } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    if (name === "emailOrUsername") {
      // Reemplazar espacios y permitir solo . y -
      let newValue = value.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
      setFormData({ ...formData, [name]: newValue });
    }

    if (e.target.name === "username") {
      // Reemplazar espacios y permitir solo . y -
      let newValue = e.target.value
        .replace(/[^a-zA-Z0-9.-]/g, "")
        .toLowerCase();
      setFormData({ ...formData, [e.target.name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = await login(formData);
      localStorage.setItem("token", token);
      updateAuthContext(user);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('../bg-login-1.jpeg')] bg-cover bg-center">
      <div className="bg-gray-200/80 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-md transition-transform duration-300 transform ">
        <div className="flex justify-center mb-4">
          <img
            src="../ridehub-logo-1.png"
            alt="RideHub Logo"
            className="w-32 sm:w-36 animate-bounce-slow"
          />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Campo de Usuario */}
          <div className="block mb-4 relative">
            <label htmlFor="emailOrUsername" className="sr-only">
              email o usuario
            </label>
            <input
              type="text"
              name="emailOrUsername"
              id="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              autoComplete="username"
              placeholder="Correo electrónico o nombre de usuario"
            />
            {/* Icono de usuario */}
            <FontAwesomeIcon
              icon="user"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="block mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              required
              autoComplete="current-password"
              placeholder="Contraseña"
            />
            {/* Icono de candado */}
            <FontAwesomeIcon
              icon="lock"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="flex justify-center items-center">
            <SecondaryButton type="submit" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </SecondaryButton>
          </div>
        </form>

        <div className="text-center mt-2">
          <p className="text-xs sm:text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-slate-900 font-medium hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
