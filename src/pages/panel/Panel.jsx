import React, { useEffect, useState } from "react";
import "./panel.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentEnrollmentChart from "../../components/Datacurso";
import { FaArrowLeftLong } from "react-icons/fa6";

const Panel = () => {
  const { id } = useParams(); // Obtener el ID del curso de los parámetros de la URL
  const [curso, setCurso] = useState(null); // Estado para almacenar los detalles del curso
  const [error, setError] = useState(""); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para redirigir después de eliminar el curso

  useEffect(() => {
    // Función para obtener la información del curso
    const fetchCursoInfo = async () => {
      try {
        // Realizar la petición al backend con el ID del curso
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
        );
        setCurso(response.data); // Guardar los datos del curso en el estado
        console.log(response.data); // Mostrar en la consola para debug
      } catch (error) {
        console.log("Error al obtener el curso", error); // Manejo de errores
        setError("Error al obtener los datos del curso");
      }
    };
    fetchCursoInfo(); // Llamar a la función para obtener la información del curso
  }, [id]);

  // Función para eliminar el curso
  const handleDeleteCourse = async () => {
    try {
      // Solicitud DELETE para eliminar el curso según el ID
      await axios.delete(
        `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
      );
      navigate("/home"); // Redirigir al usuario a la página de inicio
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      setError("No se pudo eliminar el curso. Inténtalo de nuevo más tarde.");
    }
  };

  if (!curso) {
    return <div className="loader"></div>;
  }

  return (
    <>
      <div className="cursopanel">
        <div className="tchrprfnb">
          <a href="/home">
            <FaArrowLeftLong />
          </a>
        </div>
        <StudentEnrollmentChart courseId={id} />
        <h3>Estudiantes de tu curso:</h3>
        <h4>{curso.titulo}</h4>
        {/* Verificar si el curso y los estudiantes matriculados están disponibles */}
        {curso && curso.estudiantesMatriculados.length > 0 ? (
          curso.estudiantesMatriculados.map((estudianteObj, index) => (
            <div key={index} className="studentmatri">
              {/* Mostrar la imagen de perfil del estudiante */}
              <img
                src={estudianteObj.profileImageUrl} // Aquí se debe usar el campo correcto de la imagen
                alt={estudianteObj.username}
                className="profile-image"
              />
              {/* Mostrar el nombre de usuario y el correo */}
              <div className="estudianteinfo">
                <h4>{estudianteObj.username}</h4>
                <p>{estudianteObj.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay estudiantes matriculados en este curso.</p>
        )}
        {/* Mostrar mensaje de error si ocurre */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botón para eliminar el curso */}
        <div className="delete-course-button-container">
          <button className="delete-course-button" onClick={handleDeleteCourse}>
            Eliminar Curso
          </button>
        </div>
      </div>
    </>
  );
};

export default Panel;
