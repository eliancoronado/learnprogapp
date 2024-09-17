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
        "https://api-backend-learnprog-1.onrender.com/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Error en el login", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} required />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
