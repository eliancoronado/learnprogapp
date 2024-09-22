import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
    role: "student", // Valor por defecto
  });

  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); // Redirigir si ya está autenticado
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("profileImage", formData.profileImage);
    data.append("role", formData.role);

    try {
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
      navigate("/home");
    } catch (error) {
      console.error("Error en el registro", error);
    }
  };

  return (
    <div className="rgsterpage">
      <form onSubmit={handleSubmit}>
        <h1>LearnProg</h1>
        <h3>Crea tu cuenta</h3>
        <div>
          <label>Nombre</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
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
        <div>
          <label>Imagen de perfil</label>
          <input type="file" name="profileImage" onChange={handleFileChange} />
        </div>
        <div>
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
        </div>
        <button type="submit">Registrar</button>
        <p>
          Ya tienes una cuenta <a href="/login">Inicia Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
