import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addcurso.css";

const Addcurso = () => {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    instructor: "",
    video_url: "",
    image_url: null,
    syllabus: [],
    descripcion: "",
    activities: [], // Estado adicional para las actividades
  });
  const [syllabusInput, setSyllabusInput] = useState("");
  const [activityQuestion, setActivityQuestion] = useState(""); // Estado para la pregunta
  const [activityOptions, setActivityOptions] = useState(["", "", "", ""]); // Estado para las opciones
  const [correctAnswer, setCorrectAnswer] = useState(""); // Estado para la respuesta correcta
  const [loading, setLoading] = useState(false);
  const [isFilled, setIsFilled] = useState(false); // Estado para verificar si los inputs están llenos
  const [isFilledtema, setIsFilledtema] = useState(false); // Estado para verificar si los inputs están llenos

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email) {
      const fetchUsuario = async () => {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          );
          const userData = response.data;
          setUser(userData);
          setRol(storedUser.role);
          setFormData((prevFormData) => ({
            ...prevFormData,
            instructor: userData.username,
          }));
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      fetchUsuario();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Verificar si ambos campos están llenos
    if (
      formData.titulo &&
      formData.instructor &&
      formData.video_url &&
      formData.descripcion
    ) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [formData]); // Ejecutar cada vez que formData cambie

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image_url: file });
  };

  const addSyllabusItem = () => {
    if (syllabusInput.trim() !== "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        syllabus: [...prevFormData.syllabus, syllabusInput],
      }));
      setSyllabusInput("");
    }
  };

  // Añadir una nueva pregunta y respuestas como actividad
  const addActivityItem = () => {
    if (
      activityQuestion.trim() !== "" &&
      activityOptions.every((option) => option.trim() !== "") &&
      correctAnswer.trim() !== ""
    ) {
      const newActivity = {
        question: activityQuestion,
        options: activityOptions,
        answer: correctAnswer,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        activities: [...prevFormData.activities, newActivity],
      }));

      // Limpiar campos de la actividad
      setActivityQuestion("");
      setActivityOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } else {
      alert("Por favor, completa todos los campos para agregar la actividad.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("instructor", formData.instructor);
    data.append("video_url", formData.video_url);
    data.append("descripcion", formData.descripcion);
    data.append("syllabus", JSON.stringify(formData.syllabus));
    data.append("activities", JSON.stringify(formData.activities)); // Incluir actividades en el payload

    if (formData.image_url) {
      data.append("image_url", formData.image_url);
    }

    try {
      const endpoint =
        "https://api-backend-learnprog-p4pr.onrender.com/api/auth/newcurso"; // Cambiado a la ruta correcta
      const response = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Curso creado exitosamente:", response.data);
    } catch (error) {
      console.error("Error al crear el curso", error);
      alert("Ocurrió un error al crear el curso.");
    } finally {
      setLoading(false);
      navigate("/account");
    }
  };

  return (
    <div className="addcoursepage">
      <form onSubmit={handleSubmit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50%"
          viewBox="0 0 24 24"
          style={{ fill: "rgba(50, 189, 199, 1)", transform: "", msFilter: "" }} // Cambiar a objeto
        >
          <path d="M2 7v1l11 4 9-4V7L11 4z"></path>
          <path d="M4 11v4.267c0 1.621 4.001 3.893 9 3.734 4-.126 6.586-1.972 7-3.467.024-.089.037-.178.037-.268V11L13 14l-5-1.667v3.213l-1-.364V12l-3-1z"></path>
        </svg>

        <h2>Agregar Nuevo Curso</h2>
        <div>
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Tiulo del curso"
            required
          />
        </div>
        <div>
          <label>Descripción del curso:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            placeholder="Escribe una descripción del curso"
          />
        </div>
        <div>
          <label>URL del video:</label>
          <input
            type="text"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="ej: https://youtu.be/embed/id-de-tu-video"
            required
          />
        </div>
        <div>
          <label>Imagen del curso:</label>
          <input type="file" name="image_url" onChange={handleFileChange} />
        </div>
        <div>
          <label>Instructor:</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Añadir Syllabus:</label>
          <input
            type="text"
            value={syllabusInput}
            onChange={(e) => setSyllabusInput(e.target.value)}
            placeholder="Agregar tema al syllabus"
          />
          <button
            type="button"
            onClick={addSyllabusItem}
            style={{ backgroundColor: "#38BDC7" }}
          >
            Añadir Tema
          </button>
        </div>
        <div className="dvsyll">
          <label>Syllabus Actual:</label>
          <ul>
            {formData.syllabus.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Sección para agregar actividades */}
        <div>
          <h3>Añadir Actividad</h3>
          <div>
            <label>Pregunta:</label>
            <input
              type="text"
              value={activityQuestion}
              onChange={(e) => setActivityQuestion(e.target.value)}
              placeholder="Escribe la pregunta de la actividad"
            />
          </div>
          {activityOptions.map((option, index) => (
            <div key={index}>
              <label>Opción {index + 1}:</label>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...activityOptions];
                  updatedOptions[index] = e.target.value;
                  setActivityOptions(updatedOptions);
                }}
                placeholder={`Opción ${index + 1}`}
              />
            </div>
          ))}
          <div>
            <label>Respuesta Correcta:</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Escribe la respuesta correcta"
            />
          </div>
          <button
            type="button"
            onClick={addActivityItem}
            style={{ backgroundColor: "#38BDC7" }}
          >
            Añadir Actividad
          </button>
        </div>

        {/* Mostrar las preguntas de las actividades */}
        <div className="activity-list">
          <h4>Actividades actuales:</h4>
          <ul>
            {formData.activities.map((activity, index) => (
              <li key={index}>{activity.question}</li> // Mostrar solo la pregunta de cada actividad
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: isFilled ? "#38BDC7" : "#1E2426" }}
        >
          {loading ? "Guardando..." : "Guardar curso"}
        </button>
      </form>
    </div>
  );
};

export default Addcurso;
