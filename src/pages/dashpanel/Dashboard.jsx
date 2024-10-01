import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [curso, setCurso] = useState(null);
  const [images, setImages] = useState([]); // Inicializar los estados adicionales
  const [btns, setBtns] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
        );
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      // Solo se ejecuta si user está definido
      const fetchCursos = async () => {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/auth/profile/${user._id}/cursos`
          );
          const cursos = response.data;
          if (cursos) {
            const fetchedImages = cursos.map((curso) => curso.image_url);
            setImages(fetchedImages);
            const fetchedClaves = cursos.map((curso) => curso._id);
            setBtns(fetchedClaves);
          }
          setCurso(response.data); // Almacenar los cursos obtenidos en el estado
          console.log(response.data);
        } catch (error) {
          console.log("Error al obtener los cursos tuyos");
        }
      };

      fetchCursos();
    }
  }, [user]);

  return (
    <div className="dashboard">
      <h3>Cursos que has creado</h3>
      <div className="courwr">
        {images.map((image, index) => (
          <a key={index} href={`/curso/${btns[index]}/panel`}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="course-image"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
