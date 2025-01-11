import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faPencil,
  faThumbsUp,
  faCommentAlt,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { getUserById, followUser, unfollowUser } from "../service/user";
import { getPostsByUserId } from "../service/post";
import { getEventsByUserId } from "../service/events";
import { getCommunityByUserId } from "../service/community";
import SecondaryButton from "../components/Button/SecondaryButton";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [view, setView] = useState("posts");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

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
      try {
        setLoading(true);
        const userProfile = await getUserById(id);
        const userPosts = await getPostsByUserId(id);
        const userEvents = await getEventsByUserId(id);
        const userCommunities = await getCommunityByUserId(id);

        setProfileData(userProfile.data);
        setPosts(userPosts || []);
        setEvents(userEvents || []);
        setCommunities(userCommunities || []);

        const isUserFollowing = userProfile.data.followers.some(
          (follower) => String(follower._id) === String(user.id)
        );

        setIsFollowing(isUserFollowing);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
      }
    };

    fetchData();
  }, [id, user.id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }

      setProfileData((prevData) => ({
        ...prevData,
        followersCount: isFollowing
          ? prevData.followersCount - 1
          : prevData.followersCount + 1,
        followers: isFollowing
          ? prevData.followers.filter((f) => f._id !== user.id)
          : [...prevData.followers, { _id: user.id }],
      }));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error al cambiar el estado de seguimiento:", error);
    }
  };

  /*  const updateFollowersCount = (userId, isFollowing) => {
    setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
  }; */

  const handleViewToggle = (viewType) => setView(viewType);

  const handleShowPost = (postId) => navigate(`/post/${postId}`);
  const handleShowEvent = (eventId) => navigate(`/events/${eventId}`);
  const handleShowCommunity = (communityId) => {
    if (user.role === "user") {
      Swal.fire({
        title: "Has descubierto una funcionalidad premium",
        text: "Hazte premium para unirte a comunidades",
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
    navigate(`/communities/${communityId}`);
  };

  const handleSendMensage = (userId) => {
    navigate(`/chat/${userId}`);
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
  }

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
                  <p className="text-2xl font-bold text-center sm:text-left">
                    {profileData.role === "premium" && (
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-yellow-500 mr-2"
                      />
                    )}
                    @{profileData.username}
                  </p>
                  <div className="flex gap-2 justify-center p-3 md:p-0">
                    <SecondaryButton
                      onClick={() => handleFollowToggle(id)}
                      className={`border-2 px-4 py-2 rounded ${
                        isFollowing
                          ? "bg-red-700 text-white border-red-700"
                          : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
                      } transition-all duration-300`}
                    >
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </SecondaryButton>
                    <PrimaryButton onClick={() => handleSendMensage(id)}>
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Mensaje
                    </PrimaryButton>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-6 sm:p-4 justify-center md:justify-start text-gray-600">
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("events")}
                  >
                    {events.length} Eventos
                  </button>
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("posts")}
                  >
                    {posts.length} Publicaciones
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followersCount || 0} Seguidores
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followingCount || 0} Siguiendo
                  </button>
                </div>
                <div className="mt-4 text-center md:text-left">
                  <p className="font-semibold">{profileData.fullName}</p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faPencil} />} {profileData.bio}
                  </p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                    {profileData.location}
                  </p>
                </div>
                {profileData.bikeDetails ? (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">
                      Detalles de la Moto
                    </h2>
                    <div className="flex gap-2 flex-col sm:flex-row sm:gap-4 mt-2">
                      <p>
                        Marca:{" "}
                        {profileData.bikeDetails.brand || "No especificado"}
                      </p>
                      <p>
                        Modelo:{" "}
                        {profileData.bikeDetails.model || "No especificado"}
                      </p>
                      <p>
                        Año: {profileData.bikeDetails.year || "No especificado"}
                      </p>
                      <p>
                        Matrícula:{" "}
                        {profileData.bikeDetails.licensePlate?.toUpperCase() ||
                          "No especificado"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">
                    No hay detalles de la motocicleta disponibles.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="mt-6 w-full h-auto bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-2 flex-col md:flex-row justify-center items-center">
                  <button
                    onClick={() => handleViewToggle("posts")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                      view === "posts"
                        ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                        : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                    }`}
                  >
                    Publicaciones
                  </button>
                  <button
                    onClick={() => handleViewToggle("events")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded ${
                      view === "events"
                        ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                        : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                    }`}
                  >
                    Eventos
                  </button>

                  <button
                    onClick={() => handleViewToggle("community")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded ${
                      view === "communities"
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
                        El usuario aún no tiene publicaciones.
                      </p>
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
                            <div className="flex justify-between items-center my-2 text-gray-500">
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
                        </div>
                      ))}
                    </div>
                  )
                ) : view === "events" ? (
                  events.length === 0 ? (
                    <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                      <p className="text-gray-600">
                        El usuario aún no tiene eventos.
                      </p>
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
                            src={`${event.image}`}
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
                                className={`inline-block px-3 py-1 text-xs mb-2 font-semibold rounded-full ${
                                  categoryStyles[
                                    event.category.toLowerCase()
                                  ] || categoryStyles.otros
                                }`}
                              >
                                {event.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : view === "community" ? (
                  communities.length === 0 ? (
                    <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                      <p className="text-gray-600">
                        El usuario aún no tiene comunidades.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {communities.map((comm) => (
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
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
