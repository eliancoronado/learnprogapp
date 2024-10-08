import React, { useState } from "react";
import { FaSistrix, FaBars } from "react-icons/fa6";
import "./Navbar.css";

const Navbar = () => {
  const [Sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => {
    setSidebar((prevSidebar) => !prevSidebar);
  };

  return (
    <>
      <div className={Sidebar ? "navbar active" : "navbar"}>
        <div className="nblg">
          <a href="/">LearnProg</a>
        </div>
        <div className="nbrg">
          {/* Usa una función de flecha para actualizar el estado correctamente */}
          <FaBars onClick={toggleSidebar} />
        </div>

        <div className={Sidebar ? "sidebar active" : "sidebar"}>
          <a href="/courses">
            <div className="sdbaroption">Cursos</div>
          </a>
          <a href="/teachers">
            <div className="sdbaroption">Profesores</div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
