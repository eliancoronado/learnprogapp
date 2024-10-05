import React, { useEffect, useState } from "react";
import "./panel.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentEnrollmentChart from "../../components/Datacurso";
import { CiTrash } from "react-icons/ci";
import { FaArrowLeftLong, FaRegTrashCan } from "react-icons/fa6";

const Panel = () => {
  const { id } = useParams(); // Obtener el ID del curso de los parámetros de la URL
  const [curso, setCurso] = useState(null); // Estado para almacenar los detalles del curso
  const [studentProgress, setStudentProgress] = useState({}); // Estado para almacenar el progreso de cada estudiante
  const [error, setError] = useState(""); // Estado para manejar errores
  const [isDelete, setDelete] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir después de eliminar el curso

  useEffect(() => {
    // Función para obtener la información del curso y el progreso de los estudiantes
    const fetchCursoInfo = async () => {
      try {
        // Realizar la petición al backend para obtener los detalles del curso
        const cursoResponse = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
        );
        setCurso(cursoResponse.data); // Guardar los datos del curso en el estado
        console.log(cursoResponse.data);

        const students = cursoResponse.data.estudiantesMatriculados; // Obtener estudiantes matriculados

        if (!Array.isArray(students) || students.length === 0) {
          console.error("No se encontraron estudiantes matriculados.");
          return;
        }

        // Realizar las peticiones para obtener el progreso de cada estudiante
        const progressPromises = students.map(async (estudiante) => {
          if (estudiante && estudiante._id) {
            // Cambia estudiante.estudiante por estudiante._id
            try {
              const response = await axios.get(
                `https://api-backend-learnprog-p4pr.onrender.com/api/matriculados/${estudiante._id}`
              );
              console.log(response.data);

              const cursoEncontrado = response.data.find(
                (curso) => curso._id === id
              );

              const progreso =
                cursoEncontrado?.estudiantesMatriculados.find(
                  (e) => e.estudiante === estudiante._id // Cambia estudiante.estudiante por estudiante._id
                )?.porcentajeCompletado || 0;
              console.log(progreso);

              return { [estudiante._id]: progreso }; // Cambia estudiante.estudiante por estudiante._id
            } catch (error) {
              console.error(
                "Error al obtener el progreso del estudiante:",
                error
              );
              return { [estudiante._id]: 0 }; // Cambia estudiante.estudiante por estudiante._id
            }
          } else {
            console.error("Estudiante no válido:", estudiante);
            return {};
          }
        });

        const progressResults = await Promise.all(progressPromises);

        const studentProgressMap = progressResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setStudentProgress(studentProgressMap);
      } catch (error) {
        console.error(
          "Error al obtener el curso o el progreso de los estudiantes:",
          error
        );
        setError(
          "Error al obtener los datos del curso o el progreso de los estudiantes."
        );
      }
    };

    fetchCursoInfo(); // Llamar a la función para obtener la información del curso y progreso
  }, [id]);

  // Función para eliminar el curso
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(
        `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
      );
      navigate("/home");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      setError("No se pudo eliminar el curso. Inténtalo de nuevo más tarde.");
    }
  };

  const toogleDeleteCourse = () => {
    setDelete(true);
  };
  const toogleDeleteCourseNo = () => {
    setDelete(false);
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
        {isDelete && (
          <div className="astd">
            <div className="astdbtt">
              <div className="ictrashwr">
                <FaRegTrashCan className="itrsh" />
              </div>
              <h3>Estas seguro de que deseas elimiar este curso</h3>
              <h5>Esta acción no se puede deshacer</h5>
              <div className="astdbttbtn">
                <button
                  type="button"
                  className="btncancelar"
                  onClick={toogleDeleteCourseNo}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: "#DB4A4A" }}
                  onClick={handleDeleteCourse}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        <h3>Estudiantes de tu curso:</h3>
        <h4>{curso.titulo}</h4>
        {curso.estudiantesMatriculados &&
        curso.estudiantesMatriculados.length > 0 ? (
          curso.estudiantesMatriculados.map((estudianteObj, index) => (
            <div key={index} className="studentmatri">
              <img
                src={estudianteObj.profileImageUrl}
                alt={estudianteObj.username}
                className="profile-image"
              />
              <div className="estudianteinfo">
                <h4>{estudianteObj.username}</h4>
                <p>{estudianteObj.email}</p>
                {/* Mostrar el porcentaje completado */}
                <p>Progreso: {studentProgress[estudianteObj._id] || 0}%</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay estudiantes matriculados en este curso.</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="delete-course-button-container">
          <button className="delete-course-button" onClick={toogleDeleteCourse}>
            Eliminar Curso
          </button>
        </div>
      </div>
    </>
  );
};

export default Panel;
