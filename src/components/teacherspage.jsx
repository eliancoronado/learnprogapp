import React, { useEffect, useState } from "react";
import "./teacherspage.css";

const Teacherspage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://api-backend-learnprog.onrender.com/api/auth/api/users"
        ); // URL de la API de usuarios
        const data = await response.json();
        setUsers(data); // Guardar los datos de los usuarios en el estado
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="teacherpage">
        <h1>Profesores</h1>
        <div className="tchrsimgwr">
          {users.map((user, index) => (
            <a key={index} href={`/profile/${user._id}`}>
              {" "}
              {/* Usa la ruta correcta para el perfil */}
              <div className="tchrop">
                <img src={user.image} alt={user.name} />
                <h3>{user.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Teacherspage;
