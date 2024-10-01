import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashpanel/Dashboard";
import Home from "./sections/home/Home";
import NCourses from "./sections/NewCourses/NCourses";
import Cursosacc from "./sections/cursosaccedidos/Cursosacc";

function App() {
  // Estado para almacenar el rol del usuario
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Verificar el rol del usuario en localStorage al cargar el componente
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role) {
      setRole(storedUser.role); // Almacenar el rol en el estado
    }
  }, []); // Solo se ejecuta una vez al cargar el componente

  return (
    <>
      <Navbar />
      <div className="wr">
        <Home />
        {/* Mostrar el Dashboard solo si el rol es 'teacher' */}
        {role === "teacher" && <Dashboard />}
        {role !== "teacher" && <Cursosacc />}
        <NCourses />
      </div>
    </>
  );
}

export default App;
