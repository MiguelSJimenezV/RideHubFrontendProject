import React, { useState, useEffect } from "react";
import { getEvents, deleteEvent } from "../service/events";
import { getPosts, deletePost } from "../service/post";
import { getAllCommunities, deleteCommunity } from "../service/community";
import { getAllUsers } from "../service/user";
import { updateRole, deleteAccount } from "../service/auth";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faCalendarAlt,
  faClock,
  faUserGroup,
  faUserPlus,
  faThumbsUp,
  faEnvelope,
  faComment,
  faPencil,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import SecondaryButton from "../components/Button/SecondaryButton";
import PrimaryButton from "../components/Button/PrimaryButton";
const API_URL = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [view, setView] = useState("events");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

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

    admin: "bg-red-200 text-red-800",
    premium: "bg-yellow-200 text-yellow-800",
    user: "bg-blue-200 text-blue-800",
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      switch (view) {
        case "events":
          response = await getEvents();
          setData(response.data);
          break;
        case "posts":
          response = await getPosts();
          setData(response);
          break;
        case "communities":
          response = await getAllCommunities();
          setData(response);

          break;
        case "users":
          response = await getAllUsers();
          setData(response.data);
          console.log(response.data);
          break;
        default:
          throw new Error("Vista desconocida");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleDelete = async (id, type) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de evento no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: `¿Estás seguro de elimar ${type}?`,
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
        const deleteFunction = {
          event: deleteEvent,
          post: deletePost,
          community: deleteCommunity,
          user: deleteAccount,
        }[type];
        await deleteFunction(id);
        setData(data.filter((item) => item._id !== id));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: `El ${type} se eliminó correctamente.`,
          timer: 2000,
        });
      } catch (err) {
        alert(`Error eliminando ${type}: ${err.message}`);
      }
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      console.log(userId, role);
      await updateRole(userId, role);
      setData(
        data.map((user) => (user._id === userId ? { ...user, role } : user))
      );
    } catch (err) {
      alert(`Error actualizando rol: ${err.message}`);
    }
  };

  const renderData = () => {
    if (isLoading)
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
    if (error)
      return <p className="text-center text-red-600">Error: {error}</p>;

    switch (view) {
      case "events":
        return data.map((event) => (
          <div key={event._id} className="mb-4 border rounded-lg shadow">
            <img
              src={`${event.image}`}
              alt={event.title}
              className="w-full h-48 object-cover object-center rounded-t-lg "
            />
            <div className="p-4 ">
              <div className="flex justify-start items-center">
                <img
                  src={`${event.creator?.photo}`}
                  alt={event.creator?.username}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="ml-2 font-bold text-xl">
                  {event.creator?.fullName}{" "}
                  <span className=" font-normal text-sm">
                    @{event.creator?.username}
                  </span>
                </p>
              </div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="">{event.description}</p>
              <div className="px-2 flex flex-col items-start gap-1 mt-2">
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faLocationDot} /> {event.location}{" "}
                </p>
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                  {new Date(event.date).toLocaleDateString()}{" "}
                </p>
                <p className="text-gray-600 mb-2">
                  <FontAwesomeIcon icon={faUser} />{" "}
                  {event.participants?.lenght || 0}
                </p>
              </div>
              <SecondaryButton
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={() => handleDelete(event._id, "event")}
              >
                Eliminar
              </SecondaryButton>
            </div>
          </div>
        ));
      case "posts":
        return data.map((post) => (
          <div key={post._id} className="mb-4 border rounded-lg shadow">
            <div className="">
              <img
                src={post.media ? `${post.media}` : "../default-image.jpg"}
                alt={post.description}
                className="w-full h-48 object-cover object-center rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-start items-center">
                <img
                  src={`${post.creator?.photo}`}
                  alt={post.creator?.username}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="ml-2 font-bold text-xl">
                  {post.creator?.fullName}{" "}
                  <span className=" font-normal text-sm">
                    @{post.creator?.username}
                  </span>
                </p>
              </div>
              <h3 className="font-semibold text-lg">{post.description}</h3>

              <div className="px-2 flex flex-col justify-between items-start gap-1 mt-2">
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faLocationDot} /> {post.location}
                </p>

                <div className="flex gap-4 items-center">
                  <p className="text-gray-600">
                    <FontAwesomeIcon icon={faThumbsUp} /> {""}
                    {post.likes?.lenght || 0}
                  </p>
                  <p className="text-gray-600">
                    <FontAwesomeIcon icon={faComment} /> {""}
                    {post.comments?.lenght || 0}
                  </p>
                </div>

                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faClock} /> {""}
                  {new Date(post.updatedAt).toLocaleString()}{" "}
                </p>
                {post.category && (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${
                      categoryStyles[post.category.toLowerCase()] ||
                      categoryStyles.otros
                    }`}
                  >
                    {post.category}
                  </span>
                )}
              </div>

              <SecondaryButton
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={() => handleDelete(post._id, "post")}
              >
                Eliminar
              </SecondaryButton>
            </div>
          </div>
        ));
      case "communities":
        return data.map((community) => (
          <div key={community._id} className="mb-4 border rounded-lg shadow">
            <img
              src={`${community.media}`}
              alt={community.name}
              className="w-full h-48 object-cover object-center rounded-t-lg"
            />

            <div className="p-4">
              <div className="flex justify-start items-center">
                <img
                  src={
                    community.creator?.photo
                      ? `${community.creator?.photo}`
                      : "../default-image.jpg"
                  }
                  alt={community.creator?.username}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="ml-2 font-bold text-xl">
                  {community.creator?.fullName}{" "}
                  <span className=" font-normal text-sm">
                    @{community.creator?.username}
                  </span>
                </p>
              </div>
              <h3 className="font-semibold text-lg">{community.name}</h3>
              <p>{community.description}</p>
              <p className="px-2 my-2">
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faUser} /> {""}
                  {community.members?.lenght || 0} Miembros
                </p>
              </p>

              <SecondaryButton
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={() => handleDelete(community._id, "community")}
              >
                Eliminar
              </SecondaryButton>
            </div>
          </div>
        ));
      case "users":
        return data.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between mb-4 p-4 gap-4 border rounded shadow"
          >
            <div className="">
              <div className="flex justify-start items-center mb-2">
                <img
                  src={user?.photo ? `${user?.photo}` : "../default-image.jpg"}
                  alt={user?.username}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <h3 className="ml-2 font-bold text-xl">
                  {user?.fullName}{" "}
                  <span className=" font-normal text-sm">
                    @{user?.username}
                  </span>
                </h3>
              </div>

              {user.role && (
                <span
                  className={`inline-block px-3 py-1  font-semibold rounded-full  ${
                    categoryStyles[user.role.toLowerCase()] ||
                    categoryStyles.otros
                  }`}
                >
                  <FontAwesomeIcon icon={faDice} /> {""}
                  {user.role}
                </span>
              )}

              <div className="px-2 flex flex-col justify-between items-start gap-1 mt-2">
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} /> {""}
                  {user.email}
                </p>
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faPencil} /> {""}
                  {user.bio || "Biografía no especificada"}
                </p>
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faLocationDot} /> {""}
                  {user.location || "Ubicación no especificada"}
                </p>
                <div className="flex gap-4 items-center">
                  <p className="text-gray-600">
                    <FontAwesomeIcon icon={faUserPlus} /> {""}
                    {user.followers?.lenght || 0} Seguidores
                  </p>
                  <p className="text-gray-600">
                    <FontAwesomeIcon icon={faUserGroup} /> {""}
                    {user.following?.lenght || 0} Siguiendo
                  </p>
                </div>
                <p className="text-gray-600 mb-2">
                  <FontAwesomeIcon icon={faClock} /> {""}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <select
                className="py-1 px-2 border rounded"
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
              >
                <option value="user">Usuario</option>
                <option value="premium">Vip</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <SecondaryButton
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              onClick={() => handleDelete(user._id, "user")}
            >
              Eliminar
            </SecondaryButton>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        {["events", "posts", "communities", "users"].map((item) => (
          <button
            key={item}
            className={`py-2 px-4 mb-2 rounded ${
              view === item ? "bg-gray-700" : "hover:bg-gray-600"
            }`}
            onClick={() => setView(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
        <PrimaryButton
          onClick={logout}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </PrimaryButton>
      </div>

      <div className="w-3/4 p-6 overflow-y-auto">{renderData()}</div>
    </div>
  );
};

export default Admin;
