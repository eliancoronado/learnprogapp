import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FootBar from "./FootBar";
import "../pages/teacherprofile/Teacherprofile.css";
import { FaArrowLeftLong } from "react-icons/fa6";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [Imgage, setImage] = useState(false);

  const toggleSidebar = () => {
    setImage((prevSidebar) => !prevSidebar);
  };

  useEffect(() => {
    // Obtener los datos del usuario del localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Limpiar el localStorage y redirigir al login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="tchrprfl">
        <div className="tchrprfnb">
          <a href="/home">
            <FaArrowLeftLong />
          </a>
        </div>
        <img
          src={user.profileImageUrl}
          alt="Profile"
          className={Imgage ? "image active" : "image"}
          onClick={toggleSidebar}
        />
        <h1>{user.username}</h1>
        <p>Correo: {user.email}</p>
        <p>Rol: {user.role === "teacher" ? "Profesor" : "Estudiante"}</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      <FootBar />
    </>
  );
};

export default UserProfile;
