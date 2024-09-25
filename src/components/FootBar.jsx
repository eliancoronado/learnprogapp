import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaSistrix,
  FaUsers,
  FaCircleUser,
  FaFile,
  FaGrip,
  FaBorderAll,
} from "react-icons/fa6";
import "./Footerbar.css";

const FootBar = () => {
  const [Search, setSearch] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ubicación actual

  const buscarCursos = async (query) => {
    if (!query.trim()) {
      setCursosFiltrados([]); // Limpia los resultados si no hay búsqueda
      return;
    }

    try {
      const response = await axios.get(
        `https://api-backend-learnprog-p4pr.onrender.com/api/buscar?query=${query}`
      );
      setCursosFiltrados(response.data);
    } catch (error) {
      console.error("Error al buscar cursos:", error);
      setCursosFiltrados([]); // Limpia los resultados en caso de error
    }
  };

  // Efecto para buscar cursos conforme cambia el término de búsqueda
  useEffect(() => {
    buscarCursos(busqueda);
  }, [busqueda]);

  // Maneja la redirección al curso seleccionado
  const manejarSeleccion = (id) => {
    navigate(`/curso/${id}`);
  };

  // Función para determinar si la opción es la activa
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <>
      <div className="footerbar">
        <a href="/courses">
          <div className={`fboption ${isActive("/courses")}`}>
            <FaBorderAll className="i" />
            Cursos
          </div>
        </a>
        <a href="/comunity">
          <div className={`fboption ${isActive("/community")}`}>
            <FaUsers className="i" />
            Comunidad
          </div>
        </a>
        <div className="fboption" onClick={() => setSearch(true)}>
          <FaSistrix className="i" />
          Buscar
        </div>
        <div className={`fboption ${isActive("/blog")}`}>
          <FaFile className="i" />
          Blog
        </div>
        <a href="/account">
          <div className={`fboption ${isActive("/account")}`}>
            <FaCircleUser className="i" />
            Cuenta
          </div>
        </a>
      </div>

      {/* Lo mismo aquí, para cerrar la pantalla de búsqueda */}
      <div
        className={Search ? "sscreen active" : "sscreen"}
        onClick={() => setSearch(false)}
      >
        <input
          type="text"
          placeholder="¿Qué quieres aprender hoy?"
          onClick={(e) => e.stopPropagation()}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="answ" onClick={(e) => e.stopPropagation()}>
          {cursosFiltrados.map((curso) => (
            <div
              className="answop"
              key={curso._id}
              onClick={() => manejarSeleccion(curso._id)}
            >
              {curso.titulo}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FootBar;
