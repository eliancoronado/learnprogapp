import React, { useState, useEffect } from "react";
import "./Home.css";
import CountdownTimer from "../../components/Counter";
import { FaAngleRight } from "react-icons/fa6";

const Home = () => {
  // Define la fecha de destino, por ejemplo: 1 de enero de 2025
  const targetDate = "2025-01-01T00:00:00";

  return (
    <>
      <div className="home">
        <div className="imgbaner">
          <img
            src="https://i.postimg.cc/FRT0pkWB/image-1.png"
            width="100%"
            height="auto"
          />
        </div>
        <h1>¡Octubre mes de la resistencia indígena!</h1>
        <h4>
          ¡Gracias estudiantes y programadores por confiar en nosotros para
          enseñarles a construir el futuro!
        </h4>
        <h5>En LearnProg lo celebramos contigo</h5>
        <CountdownTimer targetDate={targetDate} />
        <a href="/courses">
          <button type="button">
            Ir a mi cuenta <FaAngleRight />
          </button>
        </a>
        <p>*No necesitas tarjeta de credito</p>
      </div>
    </>
  );
};

export default Home;
