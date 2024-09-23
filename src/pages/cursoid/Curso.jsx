import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./curso.css";
import Navbar from "../../components/Navbar";
import FootBar from "../../components/FootBar";

const Curso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [haDadoLike, setHaDadoLike] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          ); // Cambia la URL según tu endpoint
          setUserId(response.data._id);
          console.log("User ID:", response.data._id);
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUsuario();
  }, []);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
        );
        setCurso(response.data);

        if (response.data.usuariosLikes.includes(userId)) {
          setHaDadoLike(true);
        }
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      }
    };

    const aumentarVistas = async () => {
      try {
        await axios.post(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}/vistas`
        );
      } catch (error) {
        console.error("Error al aumentar las vistas:", error);
      }
    };

    fetchCurso();
    aumentarVistas();
  }, [id, userId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}/likes`,
        { userId }
      );
      setCurso(response.data);
      setHaDadoLike(!haDadoLike);
    } catch (error) {
      console.error("Error al manejar el like:", error);
    }
  };

  if (!curso) return <p>Cargando...</p>;

  return (
    <>
      <Navbar />
      <div className="curso">
        <div className="curso-video">
          <iframe
            width="100%"
            height="250px"
            src={curso.video_url}
            frameBorder="0"
            allowFullScreen
            title={curso.titulo}
          ></iframe>
        </div>
        <h2>{curso.titulo}</h2>
        <p>Instructor: {curso.instructor}</p>
        <div className="flx-vlike">
          <p>Vistas: {curso.vistas}</p>
          <button
            className={`like-button ${haDadoLike ? "liked" : "noliked"}`}
            onClick={handleLike}
          >
            Likes: {curso.likes}
          </button>
        </div>

        <p className="courdesc">{curso.descripcion}</p>

        <h3>Temario:</h3>
        <div className="temario">
          {curso.syllabus.map((tema, index) => (
            <div key={index} className="tmop">
              {tema}
            </div>
          ))}
        </div>
      </div>
      <FootBar />
    </>
  );
};

export default Curso;
