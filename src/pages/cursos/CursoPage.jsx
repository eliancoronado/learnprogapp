import React from "react";
import "./Cursopage.css";
import Navbar from "../../components/Navbar";
import Carrousel from "../../components/Carrusel";
import FootBar from "../../components/FootBar";
import Courses from "../../components/Courses";

const CursoPage = () => {
  return (
    <>
      <Navbar />
      <div className="coursepagewr">
        <Carrousel />
        <Courses />
      </div>
      <FootBar />
    </>
  );
};

export default CursoPage;
