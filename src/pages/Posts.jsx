import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../service/post";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  const handleShowPost = (postId) => navigate(`/post/${postId}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await getPosts(user?.id);
        setPosts(postsResponse);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Error al obtener los datos del perfil"
        );
      } finally {
        setLoading(false); // Desactiva el estado de carga al final
      }
    };

    fetchData();
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-500">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex flex-col md:flex max-w-screen-lg w-full bg-white shadow-md rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4">Publicaciones</h1>
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  {...post}
                  onClick={() => handleShowPost(post._id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No tienes publicaciones.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
