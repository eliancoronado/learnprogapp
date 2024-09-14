import React, { useState } from "react";
import { FaSistrix, FaBars } from "react-icons/fa6";
import "./Navbar.css";

const Navbar = () => {
  const [Search, setSearch] = useState(false);
  const [Sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => {
    setSidebar((prevSidebar) => !prevSidebar);
  };

  return (
    <>
      <div className={Sidebar ? "navbar active" : "navbar"}>
        <div className="nblg">LearnProg</div>
        <div className="nbrg">
          {/* Usa una función de flecha para actualizar el estado correctamente */}
          <FaSistrix onClick={() => setSearch(true)} />
          <FaBars onClick={toggleSidebar} />
        </div>

        {/* Lo mismo aquí, para cerrar la pantalla de búsqueda */}
        <div
          className={Search ? "sscreen active" : "sscreen"}
          onClick={() => setSearch(false)}
        >
          {/* Detenemos la propagación del clic dentro del input */}
          <input
            type="text"
            placeholder="¿Qué quieres aprender hoy?"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className={Sidebar ? "sidebar active" : "sidebar"}>
          <div className="sdbaroption">Cursos</div>
          <div className="sdbaroption">Profesores</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
