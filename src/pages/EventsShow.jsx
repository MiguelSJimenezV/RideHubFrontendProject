import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getEventById,
  joinEvent,
  leaveEvent,
  getRelatedEvents,
  likeEvent,
  commentOnEvent,
} from "../service/events";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
  faUser,
  faCrown,
  faPencil,
  faCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import SecondaryButton from "../components/Button/SecondaryButton";
import PrimaryButton from "../components/Button/PrimaryButton";
const API_URL = import.meta.env.VITE_API_URL;

const ShowEvent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [registerCount, setRegisterCount] = useState(0);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleCount, setVisibleCount] = useState(3); // Número inicial de publicaciones visibles

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Incrementa en 3 las publicaciones visibles
  };

  const visiblePosts = relatedEvents.slice(0, visibleCount); // Limita las publicaciones visibles

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",
  };

  useEffect(() => {
    let isMounted = true; // Flag para verificar si el componente sigue montado.

    const fetchEvent = async () => {
      setLoading(true); // Muestra un indicador de carga solo para el evento principal.
      try {
        const eventData = await getEventById(id);
        if (isMounted) {
          setEvent(eventData.data);
          setLikeCount(eventData.data.likes?.length || 0); // Maneja el caso de likes undefined
          setComments(eventData.data.comments || []); // Si comments es undefined, asigna un array vacío
          setHasLiked(eventData.data.likes?.includes(user?.id) || false); // Maneja el caso de likes undefined
          setRegisterCount(eventData.data.participants?.length || 0); // Maneja el caso de participants undefined
          setHasRegistered(
            eventData.data.participants?.includes(user?.id) || false
          ); // Maneja el caso de participants undefined
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al obtener el evento:", err);
          setError(
            "Error al cargar los detalles del evento. Intenta de nuevo."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      isMounted = false; // Limpieza al desmontar el componente.
    };
  }, [id, user]);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        const relatedData = await getRelatedEvents(id);
        setRelatedEvents(relatedData);
      } catch (err) {
        console.error("Error al obtener eventos relacionados:", err);
      }
    };

    fetchRelatedEvents();
  }, [id]);

  const handleRegister = async () => {
    try {
      const eventData = await getEventById(id); // Trae los datos más recientes del evento
      const participants = eventData.data.participants || []; // Asegúrate de que sea un array

      // Lógica para inscribirse o desinscribirse

      if (hasRegistered) {
        await leaveEvent(id);
      } else {
        await joinEvent(id);
      }

      if (hasRegistered) {
        // Desinscripción
        const updatedParticipants = participants.filter(
          (participant) => participant !== user?.id
        );
        setRegisterCount(updatedParticipants.length);
        setHasRegistered(false);
        // Actualizar en la API si es necesario
      } else {
        // Inscripción
        const updatedParticipants = [...participants, user?.id];
        setRegisterCount(updatedParticipants.length);
        setHasRegistered(true);
        // Actualizar en la API si es necesario
      }
    } catch (err) {
      console.error("Error al inscribirse/desinscribirse:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const updatedEvent = await likeEvent(id);
      setLikeCount(updatedEvent.likes.length);
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error("Error al dar like:", err);
      setError("Error al dar like al evento.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await commentOnEvent(id, { content: comment });
      setComments(response.comments);
      setComment("");
    } catch (err) {
      console.error("Error al agregar el comentario:", err);
      setError("Error al agregar el comentario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <p className="text-gray-500">Cargando detalles del evento...</p>;
  }

  if (!event) {
    return <p className="text-gray-500">Evento no encontrado.</p>;
  }

  return (
    <div className="bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex justify-center items-center p-4 ">
        <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4 ">
          <div className="w-full p-4">
            <img
              src={`${event.image}`}
              alt="event"
              className="w-full h-48 object-cover object-center rounded-xl mb-2"
            />
            <p className="hover:text-red-700 mb-2 font-semibold">
              <div className="flex items-center">
                <img
                  src={`${event.creator.photo}`}
                  alt="Profile"
                  className="w-10 h-10 object-cover object-center rounded-full mr-2"
                />{" "}
                {event.creator.role === "premium" && (
                  <FontAwesomeIcon
                    icon={faCrown}
                    className="text-yellow-500 mr-1"
                  />
                )}
                @{event.creator.username}{" "}
                <span className="text-gray-400 font-normal ml-2">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            </p>
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">
              <FontAwesomeIcon icon={faPencil} className="mr-1" />
              {event.description}
            </p>
            <p className="text-gray-600  mb-2">
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              {event.location}
            </p>
            {event.category && (
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                  categoryStyles[event.category.toLowerCase()] ||
                  categoryStyles.other
                }`}
              >
                {event.category}
              </span>
            )}
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <PrimaryButton
                  onClick={handleLike}
                  className="flex items-center mt-2 px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800"
                >
                  <FontAwesomeIcon
                    icon={hasLiked ? faThumbsDown : faThumbsUp}
                    className="mr-2"
                  />
                  {hasLiked ? " Dislike" : " Like"}
                </PrimaryButton>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                  {likeCount}
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <SecondaryButton
                  onClick={handleRegister} // Llama a la función que maneja inscripción/desinscripción
                >
                  <FontAwesomeIcon
                    icon={hasRegistered ? faCircleXmark : faCheck} // Cambia icono basado en inscripción
                    className="mr-2"
                  />
                  {hasRegistered ? " Desinscribirse" : " Inscribirse"}{" "}
                  {/* Cambia el texto dependiendo de si está registrado */}
                </SecondaryButton>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  {registerCount}
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-3/4 flex w-full flex-col p-4">
            <div>
              <h4 className="font-semibold text-2xl ">Comentarios</h4>

              <div className="mt-4 h-80   overflow-y-auto border rounded p-2">
                {comments.length === 0 ? (
                  <p className="text-center font-medium">
                    No hay comentarios todavía.
                  </p>
                ) : (
                  comments.map((c, index) => (
                    <div
                      key={index}
                      className="p-2 border-b border-gray-200 flex justify-between items-start"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            c.user.photo
                              ? `${c.user.photo}`
                              : "../default-image.jpg"
                          }
                          alt="Profile"
                          className="w-10 h-10 object-cover object-center rounded-full"
                        />
                        <div className="ml-2">
                          <p className="ml-2 font-semibold">
                            {c.user.role === "premium" && (
                              <FontAwesomeIcon
                                icon={faCrown}
                                className="text-yellow-500 mr-1"
                              />
                            )}
                            {c.user.username}
                          </p>
                          <p className="ml-2 text-gray-500">{c.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleCommentSubmit} className="mt-2">
                <label htmlFor="comment" className="sr-only">
                  comentar
                </label>
                <input
                  id="comment"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border rounded p-2 w-full mb-2"
                  placeholder="Escribe un comentario..."
                  required
                />
                <SecondaryButton
                  type="submit"
                  className="mt-2 bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded"
                >
                  Comentar
                </SecondaryButton>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col  max-w-4xl w-full bg-white shadow-md rounded-lg p-4 ">
          <div>
            <h4 className="text-2xl font-bold mb-2 text-center md:text-left">
              Eventos Relacionados
            </h4>
            {relatedEvents.length === 0 ? (
              <p className="text-center md:text-left text-gray-500">
                No hay publicaciones relacionadas.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visiblePosts.map((event) => (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="cursor-pointer border rounded shadow-md"
                    >
                      <img
                        src={
                          event.image
                            ? `${event.image}`
                            : "../default-image.jpg"
                        }
                        alt="Post"
                        className="w-full h-48 object-cover rounded-t"
                      />
                      <div className="w-full p-4 ">
                        <div>
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-bold  text-2xl">{event.title}</p>
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
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Mostrar botón "Mostrar más" si hay más publicaciones */}
                {visibleCount < relatedEvents.length && (
                  <div className="mt-4 text-center">
                    <SecondaryButton
                      onClick={handleShowMore}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"
                    >
                      Mostrar más
                    </SecondaryButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowEvent;
