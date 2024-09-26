// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import FootBar from "./FootBar";
import "./comunity.css";

const Comunity = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", message: "" });
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario

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
      const response = await axios.get(
        "https://api-backend-learnprog-p4pr.onrender.com/api/posts"
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  // Manejar la publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Asegúrate de que el usuario esté disponible

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
  };

  const handleLike = async (id) => {
    await axios.post(
      `https://api-backend-learnprog-p4pr.onrender.com/api/posts/${id}/like`,
      { userId }
    );
    const response = await axios.get(
      "https://api-backend-learnprog-p4pr.onrender.com/api/posts"
    );
    setPosts(response.data);
  };

  return (
    <>
      <Navbar />
      <div className="comunitypage">
        <button className="inpactivecom" onClick={() => setModalOpen(true)}>
          ¿Quieres publicar algo?
        </button>
        {isModalOpen && (
          <div className="modal">
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
          {posts.map((post) => (
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
