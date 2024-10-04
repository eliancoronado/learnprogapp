import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Asegúrate de tener un componente Loader creado o importado
import "./style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
    role: "student", // Valor por defecto
  });
  const [loading, setLoading] = useState(false); // Estado para manejar el loader
  const [isFilled, setIsFilled] = useState(false); // Estado para verificar si los inputs están llenos
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); // Redirigir si ya está autenticado
    }
  }, [navigate]);

  useEffect(() => {
    // Verificar si ambos campos están llenos
    if (formData.username && formData.email && formData.password) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [formData]); // Ejecutar cada vez que formData cambie

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Esto debería mostrar el archivo que seleccionas
    setFormData({ ...formData, profileImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("profileImage:", formData.profileImage); // Esto debería mostrar el archivo seleccionado

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);

    // Solo agregar la imagen si no es null
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    data.append("role", formData.role);

    try {
      setLoading(true); // Activar el loader cuando comience el registro

      // Escoge el endpoint dependiendo del rol
      const endpoint =
        "https://api-backend-learnprog-p4pr.onrender.com/api/auth/register";

      const res = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoading(false); // Desactivar el loader cuando se complete el registro
      navigate("/home"); // Redirigir al home
    } catch (error) {
      setLoading(false); // Desactivar el loader si hay un error
      console.error("Error en el registro", error);
    }
  };

  return (
    <div className="rgsterpage">
      {loading && <Loader />}{" "}
      {/* Mostrar el loader mientras loading sea true */}
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
        <h1>LearnProg</h1>
        <h3>Crea tu cuenta</h3>
        <span></span>
        <div>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Nombre de usuario"
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Ingresa el correo"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Ingresa la contraseña"
            required
          />
        </div>
        <div>
          <label>Imagen de perfil (Opcional)</label>
          <input type="file" name="profileImage" onChange={handleFileChange} />
        </div>
        <div>
          {/* Deshabilitar botón si loading es true 
          <div className="rolsle">
            <label>Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
            </select>
          </div>
          */}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: isFilled ? "#38BDC7" : "#1E2426" }}
        >
          {" "}
          {/* Deshabilitar botón si está cargando */}
          {loading ? "Registrando..." : "Registrar"}{" "}
          {/* Mostrar texto alterno si está cargando */}
        </button>
        <p>
          Ya tienes una cuenta <a href="/login">Inicia Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
