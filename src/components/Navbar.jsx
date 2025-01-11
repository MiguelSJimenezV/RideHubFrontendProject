import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Estado para el menú del usuario
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!user) {
    navigate("/login");
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Cambiar el estado del menú en dispositivos móviles
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen); // Cambiar el estado del dropdown de usuario
  };

  // Función para cerrar ambos menús al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsOpen(false); // Cierra el menú móvil
    setUserMenuOpen(false); // Cierra el menú del usuario
  };

  // Menú de enlaces comunes
  const menuItems = [
    { name: "Eventos", to: "/" },
    { name: "Publicaciones", to: "/posts" },
    { name: "Usuarios", to: "/search" },
    { name: "Crear", to: "/create" },
    { name: "Comunidades", to: "/communities" },
    { name: "Mensajes", to: "/chat" },
  ];

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3 md:py-3">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div className="p-1">
              <img
                src="../ridehub-logo-1.png"
                className="h-10 w-10  object-center cursor-pointer "
                alt="RideHub Logo"
              />
            </div>
          </Link>
          <div className=" flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={toggleUserMenu} // Cambiar el estado del menú de usuario
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              aria-expanded={userMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-10 h-10 rounded-full"
                src={user?.photo ? `${user.photo}` : "../default-image.jpg"}
                alt="user photo"
              />
            </button>
            {userMenuOpen && (
              <div className="fixed top-1 right-32 md:right-20 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user.fullName}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {user.email}
                  </span>
                  <span>
                    {user.role === "premium" && (
                      <span className="text-xs text-yellow-500">Premium</span>
                    )}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={handleLinkClick} // Cerrar el menú al hacer clic
                    >
                      Mi Perfil
                    </Link>
                  </li>

                  <li>
                    <Link
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }} // Cerrar el menú y logout
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Cerrar Sesión
                    </Link>
                  </li>
                  {user.role === "user" && (
                    <li>
                      <Link
                        to="/premium"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={handleLinkClick} // Cerrar el menú al hacer clic
                      >
                        Hazte Premium
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <button
              onClick={toggleMenu} // Cambiar el estado del menú móvil
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isOpen ? "block" : "hidden"
            }`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* Links del menú */}
              {menuItems.map(({ name, to }) => (
                <li key={name}>
                  <Link
                    to={to}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={handleLinkClick} // Cerrar el menú al hacer clic
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
