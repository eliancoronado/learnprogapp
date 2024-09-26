import { useState } from "react";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <h1>LearnProg</h1>
        <h3>Inicia Sesión</h3>
        <div>
          <label>Correo</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            disabled={loading} // Deshabilitar input cuando loading sea true
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            disabled={loading} // Deshabilitar input cuando loading sea true
          />
        </div>
        <button type="submit" disabled={loading}>
          {" "}
          {/* Deshabilitar botón si loading es true */}
          {loading ? "Iniciando..." : "Login"}{" "}
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
