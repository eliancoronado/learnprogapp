import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import FootBar from "./FootBar";
import "../pages/teacherprofile/Teacherprofile.css";
import { FaArrowLeftLong, FaAngleLeft } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaEdit, FaSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { RiLogoutBoxLine } from "react-icons/ri";
import Loader from "./Loader";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null); // Estado para almacenar el rol del usuario
  const [Imgage, setImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);
  const [updatedesc, setUpdateDesc] = useState(null);
  const [loading, setLoading] = useState(false); // Estado del loader

  const toggleSidebar = () => {
    setImage((prevSidebar) => !prevSidebar);
  };

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
          setUpdatedName(userData.username);
          setUpdateDesc(userData.descripcion);
          setRol(userData.role); // Almacenar el rol del usuario obtenido desde la API
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      fetchUsuario();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    setUpdatedImage(e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("username", updatedName);
    formData.append("descripcion", updatedesc);
    if (updatedImage) {
      formData.append("profileImage", updatedImage);
    }

    setLoading(true); // Mostrar loader

    try {
      const response = await axios.put(
        `https://api-backend-learnprog-p4pr.onrender.com/api/updateProfile/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsEditing(false);
      } else {
        console.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al guardar los cambios del perfil:", error);
    } finally {
      setLoading(false); // Ocultar loader
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <div className="tchrprfl">
        <div className="tchrprfnb">
          <a href="/home">
            <FaAngleLeft />
          </a>
          <p>Perfil de Usuario</p>
          <span></span>
        </div>
        <div className="imgwrborder">
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className={Imgage ? "image active" : "image"}
            onClick={toggleSidebar}
          />
        </div>

        {isEditing ? (
          <div className="editinglayout">
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <input
              type="text"
              value={updatedesc}
              onChange={(e) => setUpdateDesc(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSaveProfile}>
              <FaSave />
              Guardar Cambios
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
              }}
            >
              <ImCancelCircle />
              Cancelar
            </button>
            {loading && <div className="loader"></div>} {/* Loader */}
          </div>
        ) : (
          <>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <p>{rol === "teacher" ? "Profesor" : "Estudiante"}</p>
            <>
              {user.descripcion ? (
                <>
                  <p>{user.descripcion}</p>
                </>
              ) : (
                <p>Hola estoy usando LearnProg </p>
              )}
            </>
            {/* Mostrar botón adicional si el rol es 'teacher' */}
            {rol === "teacher" && (
              <button onClick={() => navigate("/new-course")}>
                <IoIosAddCircleOutline className="iconbtn" />
                Nuevo curso
              </button>
            )}
            <button onClick={handleEditProfile}>
              {" "}
              <FaEdit />
              Editar Perfil
            </button>
          </>
        )}

        <button onClick={handleLogout}>
          <RiLogoutBoxLine />
          Cerrar Sesión
        </button>
      </div>
      <FootBar />
    </>
  );
};

export default UserProfile;
