import React, { useState } from "react";
import {
  FaSistrix,
  FaBars,
  FaGripLines,
  FaToolbox,
  FaBoxArchive,
  FaBox,
  FaRegIdCard,
  FaUsers,
  FaBlog,
  FaBlogger,
  FaBloggerB,
  FaUser,
  FaCircleUser,
  FaBone,
  FaPaperPlane,
  FaPaperclip,
  FaFile,
  FaFileWord,
  FaGrip,
} from "react-icons/fa6";
import "./Footerbar.css";

const FootBar = () => {
  const [Search, setSearch] = useState(false);
  return (
    <>
      <div className="footerbar">
        <a href="/courses">
          <div className="fboption">
            <FaGrip className="i" />
            Cursos
          </div>
        </a>
        <div className="fboption">
          <FaUsers className="i" />
          Comunidad
        </div>
        <div className="fboption" onClick={() => setSearch(true)}>
          <FaSistrix className="i" />
          Buscar
        </div>
        <div className="fboption">
          <FaFile className="i" />
          Blog
        </div>
        <div className="fboption">
          <FaCircleUser className="i" />
          Cuenta
        </div>
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
    </>
  );
};

export default FootBar;
