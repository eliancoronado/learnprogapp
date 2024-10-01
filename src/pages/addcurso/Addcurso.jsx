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
    descripcion: "", // Añadir el campo de descripción aquí
  });
  const [syllabusInput, setSyllabusInput] = useState("");
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
    if (syllabusInput.trim() !== "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        syllabus: [...prevFormData.syllabus, syllabusInput],
      }));
      setSyllabusInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("instructor", formData.instructor);
    data.append("video_url", formData.video_url);
    data.append("descripcion", formData.descripcion); // Añadir la descripción aquí
    data.append("syllabus", JSON.stringify(formData.syllabus));

    if (formData.image_url) {
      data.append("image_url", formData.image_url);
    }

    try {
      const endpoint = "http://localhost:5000/api/auth/newcurso"; // Cambiado a la ruta correcta
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
        <h2>Agregar Nuevo Curso</h2>
        <div>
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
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
            required
          />
        </div>
        <div>
          <label>Imagen del curso:</label>
          <input
            type="file"
            name="image_url" // Asegúrate de que coincida con lo que espera el backend
            onChange={handleFileChange}
          />
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
          <button type="button" onClick={addSyllabusItem}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar curso"}
        </button>
      </form>
    </div>
  );
};

export default Addcurso;
