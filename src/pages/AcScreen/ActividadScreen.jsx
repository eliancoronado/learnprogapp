import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ActividadScreen.css"; // Asegúrate de tener estilos CSS personalizados

const ActividadScreen = () => {
  const { id } = useParams(); // Obtener el ID del curso desde la URL
  const [course, setCourse] = useState(null); // Estado para almacenar el curso completo
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice de la pregunta actual
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Respuesta seleccionada
  const [showError, setShowError] = useState(false); // Mostrar error si la respuesta es incorrecta
  const [showResults, setShowResults] = useState(false); // Mostrar resultados finales
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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

  const handleProgresoClick = async () => {
    try {
      console.log(`Enviando userId: ${userId}, porcentaje: 10`); // Verifica el valor
      await axios.post(
        `https://api-backend-learnprog-p4pr.onrender.com/api/${id}/progreso`,
        {
          userId,
          porcentaje: 10,
        }
      );
      console.log("usuario aumento en 10%");
    } catch (error) {
      console.error("Error al actualizar el progreso:", error);
    }
  };

  // Obtener el curso y sus actividades desde el backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Supongamos que `courseId` es la variable que almacena el ID del curso
        console.log("Course ID:", id); // Agrega este console.log para ver el valor
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/cursos/${id}`
        );
        setCourse(response.data);
        console.log("Course data:", response.data);
      } catch (error) {
        console.error("Error al obtener el curso:", error);
      }
    };

    fetchCourse();
  }, [id]); // Dependencia de useEffect

  // Manejar la selección de respuesta
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowError(false); // Ocultar mensaje de error cuando se selecciona una nueva respuesta
  };
  const handlemalo = () => {
    navigate(`/curso/${id}/temas`);
  };

  // Verificar la respuesta y avanzar solo si es correcta
  const handleNextQuestion = () => {
    if (selectedAnswer === course.activities[currentQuestionIndex].answer) {
      setShowError(false);
      setSelectedAnswer("");

      // Si no es la última pregunta, avanzamos a la siguiente
      if (currentQuestionIndex < course.activities.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        // Si es la última pregunta, mostramos los resultados finales
        setShowResults(true);
        handleProgresoClick();
      }
    } else {
      // Si la respuesta es incorrecta, mostramos un mensaje de error
      setShowError(true);
    }
  };

  if (!course) return <div>Cargando curso...</div>;

  return (
    <div className="actividad-screen">
      <h1>{course.titulo} - Actividades</h1>

      {showResults ? (
        <div className="resultados">
          <h2>¡Has completado todas las preguntas!</h2>
          <p>Has respondido correctamente todas las preguntas. ¡Bien hecho!</p>
          <button type="button" className="hecho-btn" onClick={handlemalo}>
            Regresar
          </button>
        </div>
      ) : (
        <div className="pregunta-container">
          <h2>Pregunta {currentQuestionIndex + 1}</h2>
          <p>{course.activities[currentQuestionIndex].question}</p>

          <div className="opciones">
            {course.activities[currentQuestionIndex].options.map(
              (option, index) => (
                <button
                  key={index}
                  className={`opcion ${
                    selectedAnswer === option ? "seleccionado" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              )
            )}
          </div>

          {/* Mostrar mensaje de error si la respuesta es incorrecta */}
          {showError && (
            <div className="error-message">
              <p>Respuesta incorrecta, intenta de nuevo.</p>
              <button type="button" className="malo-btn" onClick={handlemalo}>
                Regresar
              </button>
            </div>
          )}

          <button
            className="siguiente-btn"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer} // Deshabilitar si no se ha seleccionado una respuesta
          >
            {currentQuestionIndex < course.activities.length - 1
              ? "Verificar y Siguiente"
              : "Verificar y Finalizar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActividadScreen;
