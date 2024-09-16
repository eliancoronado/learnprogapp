import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const navigate = useNavigate(); // Inicializar useNavigate

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("image", formData.image);

    try {
      const res = await axios.post(
        "https://api-backend-learnprog.onrender.com/api/auth/register", // Asegúrate de que esta es la URL correcta
        form,
        { headers: { "Content-Type": "multipart/form-data" } } // Configura el header para multipart/form-data
      );
      console.log("Usuario registrado:", res.data);

      // Redirigir a /home después del registro exitoso
      navigate("/home");
    } catch (err) {
      console.error(err.response.data);
      // Considera mostrar un mensaje de error al usuario aquí
    }
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <input type="file" name="image" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
        <p>
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
