import React, { useEffect, useState } from "react";
import FootBar from "../../components/FootBar";
import "./homepage.css";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const Homepage = () => {
  const [cursos, setCursos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
        );
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error al obtener el usuario", error);
      }
    };

    if (storedUser && storedUser.email) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user && user._id) {
      // Realizar la solicitud para obtener los cursos en los que el usuario está matriculado
      axios
        .get(
          `https://api-backend-learnprog-p4pr.onrender.com/api/matriculados/${user._id}`
        )
        .then((response) => {
          setCursos(response.data); // Almacenar los cursos en el estado
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener los cursos matriculados:", error);
          setError("Error al obtener los cursos matriculados.");
          setLoading(false);
        });
    }
  }, [user]); // Ejecutar cuando `user` cambie

  if (!user) {
    return <div className="loader"></div>;
  }

  return (
    <>
      <div className="homepagenoprincipal">
        <div className="hmpgnp-header">
          <h4>Bienvenido, {user.username}</h4>
          <h3>Comencemos a aprender!</h3>
          <div className="searchhome-button">
            <div className="serchhome-button-inherit">
              <FaSearch />
              Buscar
            </div>
          </div>
        </div>
        <div className="yourcourses">
          <h3>Tus cursos</h3>
          {loading && <p>Cargando cursos...</p>}
          {error && <p>{error}</p>}
          {!loading && cursos.length === 0 && (
            <p>
              No estás matriculado en ningún curso explora nuestra seccion de{" "}
              <a href="/courses"> cursos</a>
            </p>
          )}
          {!loading && cursos.length > 0 && (
            <div className="img-courses-acc">
              {cursos.map((curso) => {
                // Buscar el progreso del usuario en el curso
                const estudianteMatriculado =
                  curso.estudiantesMatriculados.find(
                    (est) => est.estudiante === user._id
                  );

                // Si no se encuentra el progreso, se establece como 0
                const progreso = estudianteMatriculado
                  ? estudianteMatriculado.porcentajeCompletado
                  : 0;

                return (
                  <div key={curso._id} className="curso-item">
                    <a href={`/curso/${curso._id}`}>
                      <img
                        src={curso.image_url}
                        alt={curso.titulo}
                        width="100%"
                      />
                    </a>
                    {/* Mostrar el porcentaje completado debajo de la imagen */}
                    <h3>{curso.titulo}</h3>
                    <p>Progreso: {progreso}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <FootBar />
    </>
  );
};

export default Homepage;
