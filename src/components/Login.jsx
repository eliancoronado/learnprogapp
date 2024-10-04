import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Asegúrate de tener un componente Loader creado o importado
import "./style.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Estado para manejar el loader
  const [isFilled, setIsFilled] = useState(false); // Estado para verificar si los inputs están llenos
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Verificar si ambos campos están llenos
    if (formData.email && formData.password) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [formData]); // Ejecutar cada vez que formData cambie

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el loader al enviar el formulario

    try {
      const res = await axios.post(
        "https://api-backend-learnprog-p4pr.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoading(false); // Desactivar el loader después de la respuesta exitosa
      navigate("/home");
    } catch (error) {
      setLoading(false); // Desactivar el loader si hay un error
      console.error("Error en el login", error.response?.data || error);
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
        <h3>Inicia Sesión</h3>
        <span></span>
        <div>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            placeholder="Ingresa tu correo"
            disabled={loading} // Deshabilitar input cuando loading sea true
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            placeholder="Ingresa tu contraseña"
            disabled={loading} // Deshabilitar input cuando loading sea true
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: isFilled ? "#38BDC7" : "#1E2426" }}
        >
          {" "}
          {/* Deshabilitar botón si loading es true */}
          {loading ? "Iniciando..." : "Iniciar Sesión"}{" "}
          {/* Texto alterno si está cargando */}
        </button>
        <p>
          No tienes una cuenta <a href="/">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
