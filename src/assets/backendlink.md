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

import React, { useState, useEffect } from "react";
import "./Carrusel.css"; // Asegúrate de importar el archivo CSS

const Carrousel = () => {
const [images, setImages] = useState([]);
const [titles, setTitles] = useState([]);
const [descs, setDescs] = useState([]);
const [btns, setBtns] = useState([]);

const [currentIndex, setCurrentIndex] = useState(0);
const [currentText, setCurrentText] = useState(0);
const [currentTitle, setCurrentTitle] = useState(0);
const [currentBtn, setCurrentBtn] = useState(0);

useEffect(() => {
fetch("https://api-backend-learnprog-p4pr.onrender.com/api/auth/cursos")
.then((response) => response.json())
.then((cursos) => {
if (cursos) {
const fetchedImages = cursos.map((curso) => curso.image_url); // Extraer las URLs de imágenes
setImages(fetchedImages); // Guardarlas en el estado
const fetchedTitles = cursos.map((curso) => curso.titulo); // Extraer las URLs de imágenes
setTitles(fetchedTitles); // Guardarlas en el estado
const fetchedDecs = cursos.map((curso) => curso.descripcion); // Extraer las URLs de imágenes
setDescs(fetchedDecs); // Guardarlas en el estado
const fetchedClaves = cursos.map((curso) => curso.\_id); // Extraer las URLs de imágenes
setBtns(fetchedClaves); // Guardarlas en el estado
}
})
.catch((error) => console.error("Error al obtener los cursos:", error));
}, []);

// Función para cambiar a la imagen siguiente
const nextImage = () => {
setCurrentIndex((prevIndex) =>
prevIndex === images.length - 1 ? 0 : prevIndex + 1
);
setCurrentText((prevText) =>
prevText === descs.length - 1 ? 0 : prevText + 1
);
setCurrentTitle((prevTitle) =>
prevTitle === titles.length - 1 ? 0 : prevTitle + 1
);
setCurrentBtn((prevBtn) => (prevBtn === btns.length - 1 ? 0 : prevBtn + 1));
};

// Función para cambiar a la imagen anterior
const prevImage = () => {
setCurrentIndex((prevIndex) =>
prevIndex === 0 ? images.length - 1 : prevIndex - 1
);
setCurrentText((prevText) =>
prevText === 0 ? descs.length - 1 : prevText - 1
);
setCurrentTitle((prevTitle) =>
prevTitle === 0 ? titles.length - 1 : prevTitle - 1
);
setCurrentBtn((prevBtn) => (prevBtn === 0 ? btns.length - 1 : prevBtn - 1));
};

// Efecto para cambiar automáticamente la imagen cada 3 segundos
useEffect(() => {
const interval = setInterval(nextImage, 3000); // Cambia cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte o cuando se actualice
    return () => clearInterval(interval);

}, [currentIndex, currentTitle, currentText, currentBtn]);

return (

<div className="course-page">
<div
className="carousel-container"
style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backdropFilter: "blur(50px)",
        }} >
{images.map((image, index) => (
<img
key={index}
src={image}
alt={`Slide ${index + 1}`}
className={`carousel-image ${
              index === currentIndex ? "active" : ""
            }`}
/>
))}

        <div className="carousel-buttons">
          <button onClick={prevImage} className="carousel-button">
            ❮
          </button>
          <button onClick={nextImage} className="carousel-button">
            ❯
          </button>
        </div>

        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="corstxt">
        <div className="prx">Tendencias</div>
        <h1>{titles[currentTitle]}</h1>
        <p>{descs[currentText]}</p>
        <a href={`/curso/${btns[currentBtn]}`}>
          <button type="button">Ver curso</button>
        </a>
      </div>
    </div>

);
};
export default Carrousel;

@import url('https://fonts.googleapis.com/css2?family=Days+One&family=Fira+Code:wght@300..700&family=Lalezar&display=swap');
/_Fuentes_/

/_
font-family: "Lalezar", system-ui;
font-family: "Fira Code", monospace;
font-family: "Days One", sans-serif;
_/

/_CSS_/

.course-page{
width: 100%;
height: 84vh;
}

.carousel-container {
position: relative;
width: 100%;
max-width: 600px;
margin: auto;
overflow: hidden;
border-radius: 10px;
display: flex;
justify-content: center;
align-items: center; /_ Ajusta la altura según tu diseño _/
background-size: cover;
background-position: center;
backdrop-filter: blur(5px); /_ Aplica el filtro de desenfoque al fondo _/
transition: background-image 1s ease-in-out; /_ Transición suave para el cambio de fondo _/
}

.carousel-image {
width: 100%;
height: auto;
object-fit: cover;
position: absolute;
top: 0;
left: 0;
opacity: 0;
z-index: 1;
transition: opacity 1s ease-in-out;
}

.carousel-image.active {
opacity: 1;
position: relative;
z-index: 2;
}

.carousel-buttons {
position: absolute;
top: 50%;
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
transform: translateY(-50%);
z-index: 3;
}

.carousel-button {
background-color: rgba(0, 0, 0, 0.5);
color: white;
border: none;
width: auto;
height: auto;
padding: 0.6rem 1rem;
cursor: pointer;
border-radius: 50%;
}

.carousel-button:hover {
background-color: rgba(0, 0, 0, 0.8);
}

.carousel-indicators {
position: absolute;
bottom: 10px;
width: 100%;
display: flex;
justify-content: center;
z-index: 3;
}

.indicator {
height: 10px;
width: 10px;
margin: 0 5px;
background-color: #ccc;
border-radius: 50%;
display: inline-block;
cursor: pointer;
}

.indicator.active {
background-color: #333;
}

.corstxt{
width: 100%;
height: auto;
display: flex;
align-items: center;
flex-direction: column;
padding: 0 1rem;
}

.corstxt a{
all: inherit;
}

.corstxt .prx{
padding: 0.1rem 0.8rem;
color: #0F1811 90%;
background-color: #9EF6B1;
border-radius: 8px;
font-size: 3vh;
font-family: "Lalezar", system-ui;
margin-top: 2vh;
}

.corstxt h1{
font-size: 3.5vh;
font-family: "Lalezar", system-ui;
margin-top: 1.5vh;
color: white;
font-weight: 200;
letter-spacing: 0.5px;
text-align: center;
}
.corstxt p{
font-size: 2.2vh;
font-family: "Lalezar", system-ui;
margin-top: 1.5vh;
color: #C1C4C7;
font-weight: 100;
letter-spacing: 1px;
text-align: center;
}

.corstxt button{
width: 100%;
padding: 0.6rem 0;
margin-top: 5vh;
border-radius: 8px;
color: white;
font-size: 2vh;
font-family: "Days One", sans-serif;
font-weight: 300;
background-color: #35a9fd;
border: none;
}
