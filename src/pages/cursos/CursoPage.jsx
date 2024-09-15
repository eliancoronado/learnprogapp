import React from "react";
import "./Cursopage.css";
import Navbar from "../../components/Navbar";
import Carrousel from "../../components/Carrusel";
import FootBar from "../../components/FootBar";

const CursoPage = () => {
  return (
    <>
      <Navbar />
      <div className="coursepagewr">
        <Carrousel />
      </div>
      <FootBar />
    </>
  );
};

export default CursoPage;
