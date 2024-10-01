import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./curso.css";
import Navbar from "../../components/Navbar";
import FootBar from "../../components/FootBar";
import { FaEye } from "react-icons/fa6";

const Curso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [teacherimg, setTeacherimg] = useState(null);
  const [haDadoLike, setHaDadoLike] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progresoActualizado, setProgresoActualizado] = useState(false); // Estado para el botón

  // Obtener el usuario autenticado
  useEffect(() => {
    const fetchUsuario = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          );
          setUserId(response.data._id);
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUsuario();
  }, []);

  // Obtener los datos del curso y actualizar vistas
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

  // Obtener la imagen del instructor
  useEffect(() => {
    const fetchTeacher = async () => {
      if (curso && curso.instructor) {
        const storedTeacher = curso.instructor;
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/teacherinfo/${storedTeacher}`
          );
          setTeacherimg(response.data.profileImageUrl);
        } catch (error) {
          console.error("Error al obtener los datos del teacher:", error);
        }
      }
    };

    fetchTeacher();
  }, [curso]);

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

  const handleProgresoClick = async () => {
    try {
      console.log(`Enviando userId: ${userId}, porcentaje: 10`); // Verifica el valor
      await axios.post(
        `https://api-backend-learnprog-p4pr.onrender.com/api/${id}/progreso`,
        { userId, porcentaje: 10 }
      );
      setProgresoActualizado(true);
    } catch (error) {
      console.error("Error al actualizar el progreso:", error);
    }
  };

  if (!curso) return <p>Cargando...</p>;

  const handleTemarioClick = (index) => {
    setActiveIndex(index);
  };

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
        <div className="contenido">
          <p>{curso.syllabus[activeIndex]}</p>
        </div>
        <div className="views">
          <FaEye />
          {curso.vistas} Vistas
        </div>
        <div className="techerimg">
          <img src={teacherimg} height="100%" />
          <p>{curso.instructor}</p>
        </div>
        <div className="flx-vlike">
          <button
            className={`like-button ${haDadoLike ? "liked" : "noliked"}`}
            onClick={handleLike}
          >
            Likes: {curso.likes}
          </button>
        </div>

        <div className="btnhecho">
          <button
            className={`progreso-button ${
              progresoActualizado ? "actualizado" : "no-actualizado"
            }`}
            onClick={handleProgresoClick}
          >
            Hecho
          </button>
        </div>

        <div className="courdesc">
          <p>Descripción del curso</p>
          {curso.descripcion}
        </div>

        <div className="tmrioscreen">
          <h3>Temario:</h3>
          <div className="temario">
            {curso.syllabus.map((tema, index) => (
              <div
                key={index}
                className={`tmop ${index === activeIndex ? "active" : ""}`}
                onClick={() => handleTemarioClick(index)}
              >
                {tema}
              </div>
            ))}
          </div>
        </div>

        {/* Botón para aumentar el progreso */}
      </div>
      <FootBar />
    </>
  );
};

export default Curso;
