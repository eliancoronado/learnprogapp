import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Teacherprofile.css";
import Navbar from "../../components/Navbar";
import FootBar from "../../components/FootBar";
import { FaArrowLeftLong } from "react-icons/fa6";

const TeacherProfile = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const [teacher, setTeacher] = useState(null);
  const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos
  const [Imgage, setImage] = useState(false);

  const toggleSidebar = () => {
    setImage((prevSidebar) => !prevSidebar);
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/teachers/${id}`
        );
        const data = await response.json();
        setTeacher(data); // Guardar los datos del profesor
      } catch (error) {
        console.error("Error al obtener los datos del profesor:", error);
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/profile/${id}/cursos`
        );
        const datac = await response.json();
        setCursos(datac); // Guardar los cursos
      } catch (error) {
        console.error("Error al obtener los cursos del profesor:", error);
      }
    };

    fetchTeacher();
    fetchCursos();
  }, [id]);

  if (!teacher) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="tchrprfl">
        <div className="tchrprfnb">
          <a href="/teachers">
            <FaArrowLeftLong />
          </a>
        </div>
        <img
          src={
            teacher.profileImageUrl
              ? teacher.profileImageUrl
              : "/images/default-profile.png"
          }
          alt={teacher.username}
          className={Imgage ? "image active" : "image"}
          onClick={toggleSidebar}
        />
        <h1>{teacher.username}</h1>
        <p>{teacher.email}</p>
        <h2>Cursos impartidos por {teacher.username}</h2>

        <div className="teacher-courses">
          {cursos.length > 0 ? (
            <>
              {cursos.map((curso) => (
                <a key={curso._id} href={`/curso/${curso._id}`}>
                  <img key={curso._id} src={curso.image_url} />
                </a>
              ))}
            </>
          ) : (
            <p>Este profesor no tiene cursos registrados.</p>
          )}
        </div>
      </div>

      {/* Renderizar los cursos del profesor */}

      <FootBar />
    </>
  );
};

export default TeacherProfile;
