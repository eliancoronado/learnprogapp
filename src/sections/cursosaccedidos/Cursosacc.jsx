import React, { useEffect, useState } from "react";
import axios from "axios"; // O usa fetch si prefieres
import "./cursosacc.css";

const Cursosacc = () => {
  const [cursos, setCursos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para obtener la información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          // Realiza la solicitud con el correo del usuario
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          );
          setUser(response.data);
          console.log("Usuario obtenido:", response.data);
        } else {
          setError("Usuario no autenticado.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setError("Error al obtener los datos del usuario.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // useEffect para obtener los cursos matriculados
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

  return (
    <div className="cursosacc">
      <h3>Cursos a los que te has matriculado</h3>
      {loading && <p>Cargando cursos...</p>}
      {error && <p>{error}</p>}
      {!loading && cursos.length === 0 && (
        <p>No estás matriculado en ningún curso.</p>
      )}
      {!loading && cursos.length > 0 && (
        <div className="img-courses-acc">
          {cursos.map((curso) => {
            // Buscar el progreso del usuario en el curso
            const estudianteMatriculado = curso.estudiantesMatriculados.find(
              (est) => est.estudiante === user._id
            );

            // Si no se encuentra el progreso, se establece como 0
            const progreso = estudianteMatriculado
              ? estudianteMatriculado.porcentajeCompletado
              : 0;

            return (
              <div key={curso._id} className="curso-item">
                <a href={`/curso/${curso._id}`}>
                  <img src={curso.image_url} alt={curso.titulo} width="100%" />
                </a>
                {/* Mostrar el porcentaje completado debajo de la imagen */}
                <p>Progreso: {progreso}%</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cursosacc;
