import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { faThumbsUp, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../context/AuthContext";
import {
  getPostById,
  getRelatedPosts,
  likePost,
  commentOnPost,
} from "../service/post";
import LikeButton from "../components/Button/LikeButton";
import SecondaryButton from "../components/Button/SecondaryButton";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const PostShow = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const [visibleCount, setVisibleCount] = useState(3); // Número inicial de publicaciones visibles

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Incrementa en 3 las publicaciones visibles
  };

  const visiblePosts = relatedPosts.slice(0, visibleCount); // Limita las publicaciones visibles

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
    const fetchPost = async () => {
      try {
        const postData = await getPostById(id);
        setPost(postData);
        setLikeCount(postData.likes.length);
        console.log(postData.comments);
        setComments(postData.comments);
        setHasLiked(postData.likes.includes(user.id));
      } catch (err) {
        console.error("Error al obtener la publicación:", err);
        setError("Error al obtener la publicación.");
      }
    };

    const fetchRelatedPosts = async () => {
      try {
        const relatedData = await getRelatedPosts(id);
        setRelatedPosts(relatedData);
      } catch (err) {
        console.error("Error al obtener publicaciones relacionadas:", err);
      }
    };

    fetchRelatedPosts();
    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const updatedPost = await likePost(id);
      setLikeCount(updatedPost.likes.length);
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error("Error al dar like:", err);
      setError("Error al dar like a la publicación.");
      setTimeout(() => setError(null), 3000);
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
      const response = await commentOnPost(id, { content: comment });
      setComments(response.comments);
      setComment("");
    } catch (err) {
      console.error("Error al agregar el comentario:", err);
      setError(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!post) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex justify-center items-center p-4 ">
        <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-md rounded-lg p-4 ">
          {/* Post Content */}
          <div className=" w-full p-4">
            <img
              src={`${post.media}`}
              alt="Post"
              className="w-full h-48 object-cover object-center rounded-xl mb-2"
            />

            <div className="flex items-center ">
              <img
                src={`${post.creator?.photo}`}
                alt={post.creator?.username || "Imagen no disponible"}
                className="w-10 h-10 object-cover rounded-full"
              />
              <p className="font-semibold ml-2">
                {post.creator.role === "premium" && (
                  <FontAwesomeIcon
                    icon={faCrown}
                    className="text-yellow-500 mr-1"
                  />
                )}
                @{post.creator?.username || "Anónimo"}{" "}
              </p>
              <span className="ml-2 text-gray-400 font-normal">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-gray-600 mb-2">{post.description}</h3>
            <p className="flex items-center text-gray-500 mt-1 mb-2">
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              {post.location || "Ubicación no disponible"}
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

            <div className="flex w-full justify-between items-center ">
              <p className="text-gray-500">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                {likeCount} Likes
              </p>

              <LikeButton onClick={handleLike} disabled={!user}>
                {hasLiked ? "Unlike" : "Like"}
              </LikeButton>
            </div>
          </div>

          {/* Comments Section */}
          <div className="w-3/4 ">
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
                    className=" p-2 border-b border-gray-200 flex justify-between items-start"
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
                          {c.user.username || "no definido"}
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
                Comentar
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
              <SecondaryButton type="submit">Comentar</SecondaryButton>
            </form>

            {/* Related Posts */}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col max-w-4xl w-full bg-white shadow-md rounded-lg p-4 ">
          <h4 className="text-2xl font-bold mb-2 text-center md:text-left">
            Publicaciones Relacionadas
          </h4>
          {relatedPosts.length === 0 ? (
            <p className="text-center md:text-left text-gray-500">
              No hay publicaciones relacionadas.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visiblePosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="cursor-pointer border rounded shadow-md"
                  >
                    <img
                      src={`${post.media}`}
                      alt="Post"
                      className="w-full h-48 object-cover rounded-t"
                    />
                    <div className="w-full p-4 ">
                      <div>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 2h-16c-1.104 0-2 0.896-2 2v16c0 1.104 0.896 2 2 2h8l4 4v-4h4c1.104 0 2-0.896 2-2v-16c0-1.104-0.896-2-2-2zm0 16h-5v3l-3-3h-8v-14h16v14zm-12-9h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2z" />
                            </svg>
                            {post.comments.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mostrar botón "Mostrar más" si hay más publicaciones */}
              {visibleCount < relatedPosts.length && (
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
  );
};

export default PostShow;
