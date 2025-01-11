import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper"; // Cambiado a "swiper/modules"
import "swiper/css";
import "swiper/css/navigation";

const teamMembers = [
  { name: "Juan Pérez", age: 29, role: "CEO", image: "../persona-1.jpg" },
  { name: "Ana Gómez", age: 25, role: "CMO", image: "../persona-2.jpg" },
  { name: "Carlos Díaz", age: 33, role: "CTO", image: "../persona-3.jpg" },
];

const AboutUs = () => {
  return (
    <section id="about-us" className="py-16 text-center">
      <h2 className="text-4xl font-bold mb-8 text-white">¿Quiénes Somos?</h2>
      <Swiper
        modules={[Navigation]} // Módulo Navigation correctamente configurado
        spaceBetween={3}
        slidesPerView={3}
        loop={true}
        navigation
        breakpoints={{
          640: { slidesPerView: 1 }, // Móviles
          768: { slidesPerView: 2 }, // Tablets
          1024: { slidesPerView: 3 }, // Escritorio
        }}
        className="mt-8"
      >
        {teamMembers.map((member, index) => (
          <SwiperSlide key={index} className="p-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p>Edad: {member.age}</p>
              <p>{member.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AboutUs;
