import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashpanel/Dashboard";
import Home from "./sections/home/Home";
import NCourses from "./sections/NewCourses/NCourses";
import Cursosacc from "./sections/cursosaccedidos/Cursosacc";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // Estado para almacenar el rol del usuario
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email) {
      const fetchUsuario = async () => {
        try {
          const response = await axios.get(
            `https://api-backend-learnprog-p4pr.onrender.com/api/usuarioinfo/${storedUser.email}`
          );
          const userData = response.data;
          setRol(userData.role); // Almacenar el rol del usuario obtenido desde la API
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      fetchUsuario();
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="wr">
        <Home />
        {/* Mostrar el Dashboard solo si el rol es 'teacher' */}
        {rol === "teacher" && <Dashboard />}
        <NCourses />
      </div>
    </>
  );
}

export default App;
