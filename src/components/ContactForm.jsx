import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
    console.log(formData);
  };

  return (
    <section id="contact" className="p-16 bg-gray-100/35  ">
      <div className="max-w-4xl mx-auto text-center  text-white">
        <h2 className="text-4xl font-bold mb-8  text-white">Contáctanos</h2>
        <p className="text-lg sm:text-xl mb-6  text-white">
          Si tienes alguna pregunta o comentario, no dudes en enviarnos un
          mensaje.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="sm:w-1/2">
              <label htmlFor="name" className="block text-left font-semibold">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-1/2">
              <label htmlFor="email" className="block text-left font-semibold">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full  text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block  text-left font-semibold">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 p-3 w-full rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-900 transition duration-300"
            >
              Enviar Mensaje
            </button>
          </div>
        </form>
        {isSubmitted && (
          <div className="mt-8 text-green-400 font-semibold">
            ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;
