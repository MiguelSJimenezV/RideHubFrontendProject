import { useState } from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú en móvil

  // Función para manejar el toggle del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 border border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-3  dark:bg-gray-800 shadow">
      <div className="container flex flex-wrap justify-between items-center mx-auto px-6">
        <Link href="/login" className="flex items-center">
          <img
            src="../ridehub-logo-1.png"
            className="h-10 sm:h-12"
            alt="RideHub Logo"
          />
        </Link>
        {/* Botón de menú para móviles */}
        <button
          type="button"
          onClick={toggleMenu} // Cambiar el estado al hacer clic
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {/* Menú para dispositivos móviles */}
        <div
          className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}
          id="mobile-menu"
        >
          <ul className="flex flex-col md:flex-row md:space-x-6">
            <li>
              <Link
                to="about"
                smooth={true}
                duration={500}
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Qué es RideHub
              </Link>
            </li>
            <li>
              <Link
                to="about-us"
                smooth={true}
                duration={500}
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Quiénes Somos
              </Link>
            </li>
            <li>
              <Link
                to="launch"
                smooth={true}
                duration={500}
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Lanzamiento
              </Link>
            </li>
            <li>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
