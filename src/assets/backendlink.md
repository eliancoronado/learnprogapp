https://api-backend-learnprog-p4pr.onrender.com

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import FootBar from "./FootBar";
import "../pages/teacherprofile/Teacherprofile.css";
import { FaArrowLeftLong } from "react-icons/fa6";

const UserProfile = () => {
const navigate = useNavigate();
const [user, setUser] = useState(null);
const [rol, setRol] = useState(false);
const [Imgage, setImage] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [updatedName, setUpdatedName] = useState("");
const [updatedImage, setUpdatedImage] = useState(null); // Cambiado para manejar el archivo de imagen

const toggleSidebar = () => {
setImage((prevSidebar) => !prevSidebar);
};

useEffect(() => {
const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email) {
      const fetchUsuario = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/usuarioinfo/${storedUser.email}`
          );
          const userData = response.data;
          setUser(userData);
          setUpdatedName(userData.username);
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      fetchUsuario();
    }

}, []);

useEffect(() => {
// Obtener los datos del usuario del localStorage
const storedRol = localStorage.getItem("user");
if (storedRol) {
setRol(JSON.parse(storedRol));
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
setUpdatedImage(e.target.files[0]); // Captura el archivo de imagen
};

const handleSaveProfile = async () => {
const formData = new FormData();
formData.append("username", updatedName);
if (updatedImage) {
formData.append("profileImage", updatedImage); // Agrega la imagen al FormData
}

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateProfile/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Asegúrate de que el tipo de contenido es correcto
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
    }

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
{isEditing ? (
<>
<input
type="text"
value={updatedName}
onChange={(e) => setUpdatedName(e.target.value)}
/>
<input type="file" onChange={handleFileChange} />
<button onClick={handleSaveProfile}>Guardar Cambios</button>
</>
) : (
<>
<h1>{user.username}</h1>
<p>Correo: {user.email}</p>
<p>Rol: {rol.role === "teacher" ? "Profesor" : "Estudiante"}</p>
<button onClick={handleEditProfile}>Editar Perfil</button>
</>
)}
<button onClick={handleLogout}>Cerrar Sesión</button>
</div>
<FootBar />
</>
);
};

export default UserProfile;
