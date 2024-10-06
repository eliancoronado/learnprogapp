import React, { useEffect, useState } from "react";
import "./teacherspage.css";

const Teacherspage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://api-backend-learnprog-p4pr.onrender.com/api/auth/teachers"
        ); // URL de la API de profesores
        const data = await response.json();
        setUsers(data); // Guardar los datos de los profesores en el estado
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
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
              <div className="tchrop">
                <img
                  src={
                    user.profileImageUrl
                      ? user.profileImageUrl
                      : "/images/default-profile.png"
                  }
                  alt={user.username ? user.username : "Profesor"}
                />
              </div>
              <h3>{user.username ? user.username : "Nombre no disponible"}</h3>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Teacherspage;
