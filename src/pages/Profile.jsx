import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../service/auth";
import { getPostsByUserId, deletePost } from "../service/post";
import { getEventsByUserId, deleteEvent } from "../service/events";
import { getCommunityByUserId, deleteCommunity } from "../service/community";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faPencil,
  faThumbsUp,
  faCommentAlt,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [community, setCommunity] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState("posts");
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",

    motos: "bg-red-200 text-red-800",
    accesorios: "bg-blue-200 text-blue-800",
    rutas: "bg-yellow-200 text-yellow-800",
    eventos: "bg-green-200 text-green-800",
    comunidad: "bg-slate-200 text-gray-800",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true); // Activa el estado de carga
        const profileResponse = await getProfile();
        setProfileData(profileResponse.data);

        const postsResponse = await getPostsByUserId(user.id);
        setPosts(postsResponse);

        const eventsResponse = await getEventsByUserId(user.id);
        setEvents(eventsResponse);

        const communityResponse = await getCommunityByUserId(user.id);
        setCommunity(communityResponse);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Error al obtener los datos del perfil"
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Desactiva el estado de carga al final
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user]);

  const handleEditProfile = () => navigate("/edit-profile");
  const handleToggleView = (viewType) => setView(viewType);

  const handleUpdatePost = (postId) => navigate(`/update-post/${postId}`);
  const handleUpdateEvent = (eventId) => navigate(`/update-event/${eventId}`);
  const handleUpdateCommunity = (communityId) =>
    navigate(`/update-community/${communityId}`);

  const handleDeletePost = async (postId) => {
    if (!postId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de publicación no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePost(postId);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La publicación se eliminó correctamente.",
          timer: 2000,
        });
      } catch (error) {
        console.error("No se pudo eliminar la publicación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar la publicación. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de evento no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(eventId);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El evento se eliminó correctamente.",
          timer: 2000,
        });
      } catch (error) {
        console.error("No se pudo eliminar el evento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el evento. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    if (!communityId) {
      Swal.fire({
        icon: "error",

        title: "Error",
        text: "ID de comunidad no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",

      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteCommunity(communityId);
        setCommunity((prevCommunity) =>
          prevCommunity.filter((community) => community._id !== communityId)
        );

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La comunidad se eliminó correctamente.",
          timer: 2000,
        });
      } catch (error) {
        console.error("No se pudo eliminar la comunidad:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar la comunidad. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  const handleShowPost = (postId) => navigate(`/post/${postId}`);
  const handleShowEvent = (eventId) => navigate(`/events/${eventId}`);
  const handleShowCommunity = (communityId) =>
    navigate(`/communities/${communityId}`);

  const handleCreateCommunity = async () => {
    if (user.role === "user") {
      Swal.fire({
        title: "Has descubierto una funcionalidad premium",
        text: "Hazte premium para crear comunidades",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Hazte premium",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/premium");
        }
      });
      return;
    }
    navigate("/create/community");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100   ">
        <div className="loader">
          <svg
            xml:space="preserve"
            viewBox="0 0 254.532 254.532"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            id="Capa_1"
            version="1.1"
            className="wheel"
          >
            <g>
              <path
                d="M127.267,0C57.092,0,0,57.091,0,127.266s57.092,127.266,127.267,127.266c70.174,0,127.266-57.091,127.266-127.266
      S197.44,0,127.267,0z M127.267,217.656c-49.922,0-90.391-40.468-90.391-90.39s40.469-90.39,90.391-90.39
      c49.92,0,90.39,40.468,90.39,90.39S177.186,217.656,127.267,217.656z"
                id="tire"
              ></path>
              <path
                d="M127.267,48.578c-43.39,0-78.689,35.299-78.689,78.688c0,43.389,35.3,78.688,78.689,78.688
      c43.389,0,78.688-35.299,78.688-78.688C205.955,83.877,170.655,48.578,127.267,48.578z M195.878,122.249h-38.18
      c-0.78-4.825-2.686-9.275-5.435-13.079l26.954-26.954C188.679,93.112,194.771,106.996,195.878,122.249z M132.204,58.648
      c15.244,1.087,29.123,7.156,40.025,16.591l-26.948,26.949c-3.804-2.748-8.253-4.653-13.077-5.433V58.648z M122.329,58.648v38.106
      c-4.824,0.78-9.274,2.685-13.078,5.434L82.302,75.24C93.204,65.805,107.085,59.735,122.329,58.648z M75.313,82.217l26.955,26.954
      c-2.749,3.803-4.654,8.253-5.434,13.077h-38.18C59.761,106.996,65.853,93.113,75.313,82.217z M58.643,132.123h38.192
      c0.779,4.824,2.685,9.274,5.434,13.078l-27.029,27.029C65.788,161.308,59.714,147.398,58.643,132.123z M122.329,195.884
      c-15.285-1.09-29.197-7.188-40.113-16.666l27.035-27.035c3.804,2.749,8.254,4.654,13.078,5.434V195.884z M122.329,147.459v0.072
      c-2.131-0.518-4.131-1.36-5.953-2.474l0.047-0.047c-2.85-1.738-5.244-4.132-6.982-6.983l-0.046,0.046
      c-1.114-1.822-1.956-3.821-2.474-5.952h0.071c-0.385-1.585-0.611-3.233-0.611-4.937c0-1.704,0.227-3.352,0.611-4.937h-0.071
      c0.518-2.13,1.359-4.129,2.474-5.951l0.046,0.046c1.738-2.85,4.133-5.245,6.982-6.982l-0.047-0.047
      c1.822-1.114,3.822-1.957,5.953-2.474v0.072c1.586-0.385,3.233-0.612,4.938-0.612s3.352,0.227,4.938,0.612v-0.072
      c2.131,0.518,4.13,1.359,5.951,2.473l-0.047,0.047c2.851,1.737,5.245,4.132,6.983,6.982l0.046-0.046
      c1.115,1.822,1.957,3.822,2.475,5.953h-0.071c0.385,1.585,0.611,3.233,0.611,4.937c0,1.704-0.227,3.352-0.611,4.937h0.071
      c-0.518,2.131-1.359,4.131-2.475,5.953l-0.046-0.046c-1.738,2.85-4.133,5.244-6.983,6.982l0.047,0.046
      c-1.821,1.114-3.82,1.956-5.951,2.474v-0.072c-1.586,0.385-3.233,0.612-4.938,0.612S123.915,147.845,122.329,147.459z
      M132.204,195.884v-38.267c4.824-0.78,9.273-2.685,13.077-5.433l27.034,27.034C161.4,188.696,147.488,194.794,132.204,195.884z
      M179.292,172.23l-27.028-27.028c2.749-3.804,4.654-8.254,5.435-13.079h38.191C194.818,147.398,188.745,161.308,179.292,172.23z"
                id="rim"
              ></path>
            </g>
          </svg>
          <div className="road"></div>
        </div>
      </div>
    );
    // Mensaje de carga
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profileData) {
    return <div>No se encontraron datos de perfil.</div>;
  }

  const missingFields = [];
  if (!profileData.fullName) missingFields.push("nombre completo");
  if (!profileData.bio) missingFields.push("biografía");
  if (!profileData.bikeDetails)
    missingFields.push("detalles de la motocicleta");
  if (!profileData.photo) missingFields.push("foto de perfil");
  if (!profileData.username) missingFields.push("nombre de usuario");

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex flex-col md:flex-row max-w-screen-lg w-full bg-white shadow-md rounded-lg p-4">
        {profileData && (
          <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <img
                src={
                  profileData.photo
                    ? `${profileData.photo}`
                    : "../default-image.jpg"
                }
                alt="Profile"
                className="w-40 h-40 md:w-52 md:h-52 object-cover object-center rounded-full mx-auto md:mx-0"
              />
              <div className="flex flex-col flex-1 items-center md:items-start">
                <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-4">
                  <p className="text-2xl font-bold text-center mb-2 md:mb-0 md:text-left">
                    {profileData.role === "premium" && (
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-yellow-500 mr-2"
                      />
                    )}
                    @{profileData.username}
                  </p>

                  <SecondaryButton onClick={handleEditProfile}>
                    Editar Perfil
                  </SecondaryButton>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-6 sm:p-4 justify-center md:justify-start text-gray-600">
                  <button onClick={() => handleToggleView("events")}>
                    <span className="hover:text-red-700">
                      {events.length} Eventos
                    </span>
                  </button>
                  <button onClick={() => handleToggleView("posts")}>
                    <span className="hover:text-red-700">
                      {posts.length} Publicaciones
                    </span>
                  </button>
                  <p>
                    <span>{profileData.followers?.length || 0} Seguidores</span>
                  </p>
                  <p>
                    <span>{profileData.following?.length || 0} Siguiendo</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-center md:text-left">
                  <p className="font-semibold text-lg mb-2">
                    {profileData.fullName}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {<FontAwesomeIcon icon={faPencil} />} {profileData.bio}
                  </p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                    {profileData.location}
                  </p>
                </div>

                {profileData.bikeDetails ? (
                  <div className="mt-4 sm:mt-0 text-center md:text-left ">
                    <h2 className="text-lg font-semibold sm:text-center">
                      Detalles de la Moto
                    </h2>
                    <div className="flex gap-2 flex-col sm:flex-row sm:gap-4 mt-2">
                      <p className="text-gray-600">
                        Marca:{" "}
                        {profileData.bikeDetails.brand || "No especificado"}
                      </p>
                      <p className="text-gray-600">
                        Modelo:{" "}
                        {profileData.bikeDetails.model || "No especificado"}
                      </p>
                      <p className="text-gray-600">
                        Año: {profileData.bikeDetails.year || "No especificado"}
                      </p>
                      <p className="text-gray-600">
                        Matrícula:{" "}
                        {profileData.bikeDetails.licensePlate.toUpperCase() ||
                          "No especificado"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">
                    No hay detalles de la motocicleta disponibles.
                  </div>
                )}

                {missingFields.length > 0 && (
                  <div className="mt-4 text-red-700">
                    <p>
                      Parece que te falta completar tu{" "}
                      {missingFields.join(", ")}. ¡Haz clic en{" "}
                      <span className="font-semibold"> Editar Perfil</span>
                      para completar esos datos!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 w-full h-auto bg-white p-4 rounded-lg shadow-md">
              <div className="flex gap-2 flex-col md:flex-row justify-center items-center">
                <button
                  onClick={() => handleToggleView("posts")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "posts"
                      ? " bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : " text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Publicaciones
                </button>
                <button
                  onClick={() => handleToggleView("events")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "events"
                      ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Eventos
                </button>

                <button
                  onClick={() => handleToggleView("community")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "community"
                      ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Comunidades
                </button>
              </div>
            </div>
            <div className="mt-6">
              {view === "posts" ? (
                posts.length === 0 ? (
                  <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                    <p className="text-gray-600">
                      Aún no tienes publicaciones.
                    </p>
                    <PrimaryButton onClick={() => navigate("/create/post")}>
                      Crear Publicación
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => handleShowPost(post._id)}
                        className="cursor-pointer border rounded shadow-md"
                      >
                        <img
                          src={`${post.media}`}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-t"
                        />
                        <div className="w-full px-4">
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-semibold mt-2">
                            {post.description.length > 80
                              ? `${post.description.substring(0, 80)}...`
                              : post.description}
                          </p>
                          <p className="flex items-center text-gray-500 mt-1">
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="mr-1"
                            />
                            {post.location}
                          </p>
                          {post.category && (
                            <span
                              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                categoryStyles[post.category.toLowerCase()] ||
                                categoryStyles.otros
                              }`}
                            >
                              {post.category}
                            </span>
                          )}
                          <div className="flex justify-between items-center mt-2 text-gray-500">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="mr-1"
                              />
                              {post.likes.length}
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faCommentAlt}
                                className="mr-1"
                              />
                              {post.comments.length}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <PrimaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdatePost(post._id);
                            }}
                          >
                            Editar
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post._id);
                            }}
                          >
                            Eliminar
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : view === "events" ? (
                events.length === 0 ? (
                  <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                    <p className="text-gray-600">Aún no tienes eventos.</p>
                    <PrimaryButton onClick={() => navigate("/create/event")}>
                      Crear Evento
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="cursor-pointer border rounded shadow-md"
                        onClick={() => handleShowEvent(event._id)}
                      >
                        <img
                          src={event.image}
                          alt="Event"
                          className="w-full h-48 object-cover rounded-t"
                        />
                        <div className="w-full px-4">
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-bold text-2xl">{event.title}</p>
                          <p className="font-medium text-gray-600 mb-2">
                            {event.description.length > 80
                              ? `${event.description.substring(0, 80)}...`
                              : event.description}
                          </p>
                          <p className="flex items-center text-gray-500 mb-2">
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="mr-1"
                            />
                            {event.location}
                          </p>
                          <p className="text-gray-500 mb-2">
                            <FontAwesomeIcon icon={faUser} className="mr-1" />
                            {event.participants.length}
                          </p>
                          {event.category && (
                            <span
                              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                categoryStyles[event.category.toLowerCase()] ||
                                categoryStyles.otros
                              }`}
                            >
                              {event.category}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <PrimaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateEvent(event._id);
                            }}
                          >
                            Editar
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event._id);
                            }}
                          >
                            Eliminar
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : view === "community" ? (
                community.length === 0 ? (
                  <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                    <p className="text-gray-600">Aún no tienes comunidades.</p>
                    <PrimaryButton onClick={() => handleCreateCommunity()}>
                      Crear Comunidad
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {community.map((comm) => (
                      <div
                        key={comm._id}
                        className="cursor-pointer border rounded shadow-md"
                        onClick={() => handleShowCommunity(comm._id)}
                      >
                        <img
                          src={
                            comm.media
                              ? `${comm.media}`
                              : "../default-image.jpg"
                          }
                          alt="Community"
                          className="w-full h-48 object-cover object-center rounded-t"
                        />
                        <div className="w-full px-4">
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-bold text-2xl">{comm.name}</p>
                          <p className="font-medium text-gray-600 mb-2">
                            {comm.description.length > 80
                              ? `${comm.description.substring(0, 80)}...`
                              : comm.description}
                          </p>

                          <p className="text-gray-500 mb-2">
                            <FontAwesomeIcon icon={faUser} className="mr-1" />
                            {comm.members.length}
                          </p>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <PrimaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCommunity(comm._id);
                            }}
                          >
                            Editar
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCommunity(comm._id);
                            }}
                          >
                            Eliminar
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
