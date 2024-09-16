import React from "react";
import Navbar from "../../components/Navbar";
import Carrousel from "../../components/Carrusel";
import FootBar from "../../components/FootBar";
import Courses from "../../components/Courses";
import Teacherspage from "../../components/teacherspage";
import "./teachers.css";

const Teachers = () => {
  return (
    <>
      <div className="teacherpages">
        <Navbar />
        <div className="coursepagewr">
          <Teacherspage />
        </div>
        <FootBar />
      </div>
    </>
  );
};

export default Teachers;
