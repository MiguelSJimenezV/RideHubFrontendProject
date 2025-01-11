import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarLanding from "../components/NavbarLanding";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register"); // Redirige a la página de registro
  };

  return (
    <div className="min-h-screen bg-[url('../bg1.jpg')] bg-cover bg-center bg-fixed">
      {/* Navbar */}
      <NavbarLanding />

      <div className="container mx-auto px-4">
        {/* Sección Qué es RideHub */}
        <section
          id="about"
          className="mt-12 mb-8 flex flex-col-reverse md:flex-row items-center gap-6"
        >
          <div className="flex-1">
            <img
              src="../rider-1.jpg"
              alt="RideHub"
              className="w-full h-56 sm:h-72 object-cover rounded-3xl shadow-lg"
            />
          </div>
          <div className="flex-1 bg-gray-800/90 text-white rounded-3xl p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-4">¿Qué es RideHub?</h2>
            <p className="text-base sm:text-lg">
              RideHub es la comunidad ideal para los amantes de las motos.
              Conéctate con otros motociclistas, comparte rutas, compra y vende
              accesorios, y organiza eventos de motos en tu área.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-red-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base hover:bg-red-500 hover:scale-105 transition-transform mt-4"
            >
              ¡Únete ahora!
            </button>
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="features" className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Funcionalidades de RideHub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card Ejemplo */}

            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-3xl text-red-600">
                <i className="fas fa-route"></i>{" "}
                {/* Puedes cambiar el ícono por uno que te guste */}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comparte Experiencias
              </h3>
              <p className="text-gray-600">
                Comparte las mejores rutas para motos, encuentra nuevos destinos
                y conecta con otros motociclistas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-3xl text-red-600">
                <i className="fas fa-motorcycle"></i>{" "}
                {/* Ícono de motocicleta */}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Conoce motociclistas
              </h3>
              <p className="text-gray-600">
                Encuentra otros motociclistas en tu área, sigue a tus favoritos
                y comparte tus experiencias.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-3xl text-red-600">
                <i className="fas fa-calendar-check"></i>{" "}
                {/* Ícono de calendario */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Eventos de Motos</h3>
              <p className="text-gray-600">
                Organiza y participa en eventos relacionados con motos, desde
                encuentros hasta rutas grupales.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-3xl text-red-600">
                <i className="fas fa-users"></i> {/* Ícono de usuarios */}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Conecta con la Comunidad
              </h3>
              <p className="text-gray-600">
                Únete a la comunidad de RideHub, sigue a otros motociclistas,
                comparte experiencias y más.
              </p>
            </div>
          </div>
        </section>

        {/* Quiénes somos */}
        <div className="mb-12">
          <AboutUs />
        </div>

        {/* Lanzamiento */}
        <section
          id="launch"
          className="bg-gray-800/50 text-white text-center p-12 rounded-3xl mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            ¡Prepárate para el lanzamiento!
          </h2>
          <p className="text-base sm:text-lg mb-6">
            RideHub está a punto de revolucionar cómo se conectan los
            motociclistas. ¡Únete ya!
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-red-600 py-3 px-8 text-lg rounded-lg hover:bg-black hover:scale-105 transition-transform"
          >
            ¡Comienza ahora!
          </button>
        </section>

        {/* Formulario de contacto */}
        <div id="contact">
          <ContactForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} RideHub. Todos los derechos
            reservados.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              Términos de Servicio
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Política de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
