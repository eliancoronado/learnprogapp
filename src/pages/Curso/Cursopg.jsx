import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import FootBar from "../../components/FootBar";
import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import "./cursopg.css";
import axios from "axios";

const Cursopg = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook de navegación
  const [curso, setCurso] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isMatriculado, setIsMatriculado] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario logueado
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

  useEffect(() => {
    // Obtener datos del curso y verificar si el usuario está matriculado
    const fetchCurso = async () => {
      try {
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
        );
        setCurso(response.data);
        // Verificar valores en la consola
        console.log("Curso obtenido:", response.data);
        console.log("User ID:", userId);

        if (response.data.estudiantesMatriculados.includes(userId)) {
          console.log("El usuario ya está matriculado.");
          setIsMatriculado(true);
          // Redirigir al usuario a la ruta de los temas del curso
          navigate(`/curso/${id}/temas`);
        }
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      }
    };

    if (userId) {
      fetchCurso();
    }
  }, [id, userId, navigate]);

  const handleMatricularme = async () => {
    try {
      const response = await axios.post(
        `https://api-backend-learnprog-p4pr.onrender.com/api/matricular/${id}`,
        {
          userId,
        }
      );
      setIsMatriculado(true);
      console.log("Usuario matriculado exitosamente:", response.data);
      // Redirigir al usuario a la ruta de los temas del curso
      navigate(`/curso/${id}/temas`);
    } catch (error) {
      console.error("Error al matricular al usuario:", error);
    }
  };

  if (!curso) return <p>Cargando...</p>;

  return (
    <>
      <Navbar />
      <div className="cursopg">
        <div className="imgcurso">
          {curso && (
            <img src={curso.image_url} width="100%" alt="Imagen del curso" />
          )}
        </div>
        <h3>{curso.titulo}</h3>
        <p>{curso.descripcion}</p>
        <div className="qaprenderas">
          <h5>¿Qué aprenderás?</h5>
          <h4>
            <span>
              <FaCircleCheck />
            </span>
            Lo que aprenderás
          </h4>
          <h4>
            <span>
              <FaCircleCheck />
            </span>
            Lo que aprenderás
          </h4>
        </div>
        <div className="matricularme">
          {!isMatriculado ? (
            <>
              <h4>¡Matricúlate ahora!</h4>
              <button type="button" onClick={handleMatricularme}>
                ¡Matricularme ahora!
              </button>
            </>
          ) : (
            <h4>Ya estás matriculado en este curso</h4>
          )}
        </div>
      </div>
      <FootBar />
    </>
  );
};

export default Cursopg;
