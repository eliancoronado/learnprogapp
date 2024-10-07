import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./curso.css";
import Navbar from "../../components/Navbar";
import FootBar from "../../components/FootBar";
import { FaEye, FaAngleRight } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import { BsPlayBtnFill } from "react-icons/bs";

const Curso = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [user, setUser] = useState(null);
  const [teacherimg, setTeacherimg] = useState(null);
  const [haDadoLike, setHaDadoLike] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progreso, setProgreso] = useState(false); // Estado para el progreso

  const navigate = useNavigate();

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
          setUser(response.data);
          console.log("el usuario id es ", response.data._id);
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
        const cursoData = response.data;
        setCurso(cursoData);

        if (response.data.usuariosLikes.includes(userId)) {
          setHaDadoLike(true);
        }
        console.log(cursoData);

        // Verificar si la propiedad estudiantesMatriculados existe y tiene datos
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      }
    };

    fetchCurso();
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

  useEffect(() => {
    const aumentarVistas = async () => {
      try {
        const aumentar = await axios.post(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}/vistas`
        );
        console.log(aumentar);
      } catch (error) {
        console.log("Error al aumentar las vistas", error);
      }
    };

    aumentarVistas();
  }, [id]);

  const handleActividad = async (index) => {
    navigate(`/curso/${id}/actividades/${index}`); // Navega a las actividades del tema activo
  };

  const handleTemarioClick = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (user && user._id) {
      // Realizar la solicitud para obtener los cursos en los que el usuario está matriculado
      axios
        .get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/matriculados/${user._id}`
        )
        .then((response) => {
          const progressdata = response.data;
          console.log("Respuesta de la API:", progressdata); // Para depurar

          // Verifica si progressdata es un arreglo
          if (Array.isArray(progressdata) && progressdata.length > 0) {
            const estudianteMatriculado =
              progressdata[0].estudiantesMatriculados.find(
                (est) => est.estudiante.toString() === user._id
              );

            // Si el estudiante está matriculado, verificar el progreso
            if (estudianteMatriculado) {
              const progresoEstudiante =
                estudianteMatriculado.porcentajeCompletado;
              console.log("Progreso del estudiante:", progresoEstudiante);
              if (progresoEstudiante > 0) {
                setProgreso(true);
              } else {
                setProgreso(false);
              }
            }
          } else {
            console.error(
              "La propiedad estudiantesMatriculados no es un arreglo o está indefinida."
            );
          }
          console.log("Estudiantes matriculados:", progressdata);
        })
        .catch((error) => {
          console.error("Error al obtener los cursos matriculados:", error);
        });
    }
  }, [user]); // Ejecutar cuando `user` cambie

  if (!curso) return <div className="loader"></div>;

  return (
    <>
      <div className="curso">
        <div className="curso-video">
          <iframe
            width="100%"
            height="250px"
            frameBorder="0"
            allowFullScreen
            src={curso.syllabus[activeIndex].video_url}
            title={curso.titulo}
          ></iframe>
        </div>
        <h2>{curso.titulo}</h2>
        <div className="contenido">
          <p>{curso.syllabus[activeIndex].titulo}</p>
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
            <AiOutlineLike className="itmop2" />
            {curso.likes}
          </button>
        </div>
        <div className="btnhecho">
          <button
            className={`progreso-button`}
            onClick={progreso ? null : () => handleActividad(activeIndex)} // Pasa el índice activo aquí
            disabled={progreso} // Deshabilitar el botón si progreso es true
          >
            {progreso ? "Ya se realizó la actividad" : "Ir a la actividad"}
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
                {tema.titulo}
                <FaAngleRight className="itmop2" />
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
