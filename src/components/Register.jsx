import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const navigate = useNavigate();

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

    try {
      const res = await axios.post(
        "https://api-backend-learnprog-1.onrender.com/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Error en el registro", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input type="text" name="username" onChange={handleChange} required />
      </div>
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
      <div>
        <label>Profile Image</label>
        <input
          type="file"
          name="profileImage"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
