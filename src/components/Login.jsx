import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      navigate("/home");
    } catch (error) {
      console.error("Error en el login", error.response?.data || error);
    }
  };

  return (
    <div className="rgsterpage">
      <form onSubmit={handleSubmit}>
        <h1>LearnProg</h1>
        <h3>Inicia Sesión</h3>
        <div>
          <label>Correo</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          No tienes una cuenta <a href="/">Registrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
