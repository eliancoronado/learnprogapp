import React, { useState } from "react";
import { FaSistrix, FaBars } from "react-icons/fa6";
import "./Navbar.css";

const Navbar = () => {
  const [Search, setSearch] = useState(false);

  return (
    <>
      <div className="navbar">
        <div className="nblg">LearnProg</div>
        <div className="nbrg">
          {/* Usa una función de flecha para actualizar el estado correctamente */}
          <FaSistrix onClick={() => setSearch(true)} />
          <FaBars />
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
      </div>
    </>
  );
};

export default Navbar;
