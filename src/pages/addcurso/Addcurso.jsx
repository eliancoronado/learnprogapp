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
    image_url: null,
    descripcion: "",
    syllabus: [], // Mantener el syllabus vacío para agregar temas después
  });
  const [modalTemaVisible, setModalTemaVisible] = useState(false); // Estado para controlar el modal de temas
  const [modalActividadVisible, setModalActividadVisible] = useState(false); // Estado para controlar el modal de actividades
  const [currentTema, setCurrentTema] = useState(""); // Estado para el tema actual
  const [videoUrl, setVideoUrl] = useState(""); // Estado para la URL del video dentro del modal de temas
  const [activities, setActivities] = useState([]); // Actividades dentro del tema actual

  // Estados para la actividad actual
  const [activityQuestion, setActivityQuestion] = useState(""); // Estado para la pregunta
  const [activityOptions, setActivityOptions] = useState(["", "", "", ""]); // Estado para las opciones
  const [correctAnswer, setCorrectAnswer] = useState(""); // Estado para la respuesta correcta

  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image_url: file });
  };

  const addSyllabusItem = () => {
    if (currentTema.trim() !== "" && videoUrl.trim() !== "") {
      const newSyllabusItem = {
        titulo: currentTema,
        video_url: videoUrl,
        activities,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        syllabus: [...prevFormData.syllabus, newSyllabusItem],
      }));

      // Limpiar el estado del modal y ocultarlo
      setCurrentTema("");
      setVideoUrl("");
      setActivities([]);
      setModalTemaVisible(false);
    } else {
      alert("Por favor, completa todos los campos para agregar el tema.");
    }
  };

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

      setActivities((prevActivities) => [...prevActivities, newActivity]);

      // Limpiar campos de la actividad
      setActivityQuestion("");
      setActivityOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setModalActividadVisible(false); // Cerrar el modal de actividades
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
    data.append("descripcion", formData.descripcion);
    data.append("syllabus", JSON.stringify(formData.syllabus)); // Enviar syllabus como JSON

    if (formData.image_url) {
      data.append("image_url", formData.image_url);
    }

    try {
      const endpoint =
        "https://api-backend-learnprog-p4pr.onrender.com/api/auth/newcurso";
      const response = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Curso creado exitosamente:", response.data);
      alert("Curso creado exitosamente");
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
        <h2>Agregar Nuevo Curso</h2>
        <div>
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Título del curso"
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

        <div className="dvsyll">
          <label>Syllabus Actual:</label>
          <ul>
            {formData.syllabus.map((tema, index) => (
              <li key={index}>{tema.tema}</li>
            ))}
          </ul>
        </div>

        {/* Botón para mostrar el modal de añadir tema */}
        <button
          type="button"
          onClick={() => setModalTemaVisible(true)}
          style={{ backgroundColor: "#38BDC7" }}
        >
          Añadir Tema al Curso
        </button>

        {/* Modal para añadir temas */}
        {modalTemaVisible && (
          <div className="modal">
            <h3>Añadir Tema</h3>
            <div>
              <label>Tema:</label>
              <input
                type="text"
                value={currentTema}
                onChange={(e) => setCurrentTema(e.target.value)}
                placeholder="Tema del curso"
              />
            </div>
            <div>
              <label>URL del Video:</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="ej: https://youtu.be/embed/id-de-tu-video"
              />
            </div>

            <div>
              <h4>Actividades del Tema:</h4>
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>{activity.question}</li>
                ))}
              </ul>
            </div>

            {/* Botón para añadir actividad al tema */}
            <button
              type="button"
              onClick={() => setModalActividadVisible(true)}
              style={{ backgroundColor: "#38BDC7" }}
            >
              Añadir Actividad al Tema
            </button>

            {modalActividadVisible && (
              <div className="modal">
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
                      onChange={(e) =>
                        setActivityOptions(
                          activityOptions.map((opt, idx) =>
                            idx === index ? e.target.value : opt
                          )
                        )
                      }
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
                <button
                  type="button"
                  onClick={() => setModalActividadVisible(false)}
                  style={{ backgroundColor: "#F5A623" }}
                >
                  Cerrar
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={addSyllabusItem}
              style={{ backgroundColor: "#38BDC7" }}
            >
              Guardar Tema
            </button>
            <button
              type="button"
              onClick={() => setModalTemaVisible(false)}
              style={{ backgroundColor: "#F5A623" }}
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Modal para añadir actividades */}

        <button
          type="submit"
          style={{ backgroundColor: loading ? "grey" : "#38BDC7" }}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear Curso"}
        </button>
      </form>
    </div>
  );
};

export default Addcurso;
