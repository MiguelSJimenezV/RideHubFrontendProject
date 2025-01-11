import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
  // Si el usuario no está autenticado, redirigir a la página de registro
}

export default ProtectedRoute;
