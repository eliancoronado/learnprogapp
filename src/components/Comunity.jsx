import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import FootBar from "./FootBar";
import Loader from "./Loader"; // Asegúrate de tener un componente Loader creado o importado
import "./comunity.css";
import io from "socket.io-client"; // Importar la biblioteca

const socket = io("https://api-backend-learnprog-p4pr.onrender.com", {
  transports: ["websocket", "polling"], // Especifica los transportes que debe usar
  withCredentials: true, // Si necesitas usar cookies o credenciales
});

socket.on("connect", () => {
  console.log("Conectado al servidor de Socket.IO");
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión:", err);
});

const Comunity = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", message: "" });
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(false); // Estado del loader

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email) {
      const fetchUsuario = async () => {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          );
          const userData = response.data;
          console.log("Datos del usuario obtenidos:", userData);
          setUser(userData); // Almacena la información del usuario
          setUserId(userData._id);
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      fetchUsuario();
    }
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Mostrar loader mientras se cargan los posts
      try {
        const response = await axios.get(
          "https://api-backend-learnprog-p4pr.onrender.com/api/posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error al obtener los posts:", error);
      } finally {
        setLoading(false); // Ocultar loader una vez cargados los posts
      }
    };
    fetchPosts();
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Agregar el nuevo post a la lista
    });

    // Limpiar el evento cuando se desmonte el componente
    return () => {
      socket.off("newPost");
    };
  }, []);

  // Manejar la publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Asegúrate de que el usuario esté disponible

    setLoading(true); // Mostrar loader al iniciar la publicación
    try {
      const post = { ...newPost, userId: user._id }; // Usa el ID del usuario
      await axios.post(
        "https://api-backend-learnprog-p4pr.onrender.com/api/posts",
        post
      );
      setModalOpen(false);
      setNewPost({ title: "", message: "" });

      // Refetch posts
      const response = await axios.get(
        "https://api-backend-learnprog-p4pr.onrender.com/api/posts"
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setLoading(false); // Ocultar loader después de completar la publicación
    }
  };

  const handleLike = async (id) => {
    setLoading(true); // Mostrar loader al iniciar el like
    try {
      await axios.post(
        `https://api-backend-learnprog-p4pr.onrender.com/api/posts/${id}/like`,
        {
          userId,
        }
      );
      const response = await axios.get(
        "https://api-backend-learnprog-p4pr.onrender.com/api/posts"
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setLoading(false); // Ocultar loader después de completar la acción
    }
  };

  // Ordenar los posts por la fecha de creación de forma descendente antes de mostrarlos
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <Navbar />
      <div className="comunitypage">
        {loading && <Loader />} {/* Mostrar loader mientras loading sea true */}
        <button className="inpactivecom" onClick={() => setModalOpen(true)}>
          ¿Quieres publicar algo?
        </button>
        {isModalOpen && (
          <div className="modaltopost">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Título"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Mensaje"
                value={newPost.message}
                onChange={(e) =>
                  setNewPost({ ...newPost, message: e.target.value })
                }
                required
              />
              <button type="submit">Publicar</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cerrar
              </button>
            </form>
          </div>
        )}
        <div>
          {sortedPosts.map((post) => (
            <div key={post._id} className="post">
              <h3>{post.title}</h3>
              {post.user ? ( // Verificar si el post tiene un usuario asociado
                <>
                  <div className="userdatadiv">
                    <img src={post.user.profileImageUrl} alt="Perfil" />
                    <p>
                      {post.user.username} <span>{post.user.email}</span>
                    </p>
                  </div>
                </>
              ) : (
                <p>Usuario desconocido</p> // Mensaje para posts sin usuario
              )}
              <p className="datapost">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <p className="postmessage">{post.message}</p>
              <div className="zonelike">
                <button onClick={() => handleLike(post._id)}>
                  Likes: {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FootBar />
    </>
  );
};

export default Comunity;
