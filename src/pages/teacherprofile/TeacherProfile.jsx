import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Teacherprofile.css";
import FootBar from "../../components/FootBar";
import { FaArrowLeftLong, FaAngleLeft } from "react-icons/fa6";

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
          `https://api-backend-learnprog-p4pr.onrender.com/api/auth/teachers/${id}`
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
          `https://api-backend-learnprog-p4pr.onrender.com/api/auth/profile/${id}/cursos`
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
      <div className="tchrprfl">
        <div className="tchrprfnb">
          <a href="/teachers">
            <FaAngleLeft />
          </a>
          <p>Perfil del profesor</p>
          <span></span>
        </div>
        <div className="imgwrborder">
          <img
            src={teacher.profileImageUrl}
            alt={teacher.username}
            className={Imgage ? "image active" : "image"}
            onClick={toggleSidebar}
          />
        </div>
        <h1>{teacher.username}</h1>
        <p>{teacher.email}</p>
        <div className="fajadecambio">
          <div className="fjdecmop">Acerca</div>
          <div className="fjdecmop active">Cursos</div>
          <div className="fjdecmop">Reviews</div>
        </div>

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
