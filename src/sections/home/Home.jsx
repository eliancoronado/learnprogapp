import React, { useState, useEffect } from "react";
import "./Home.css";
import CountdownTimer from "../../components/Counter";

const Home = () => {
  // Define la fecha de destino, por ejemplo: 1 de enero de 2025
  const targetDate = "2025-01-01T00:00:00";

  return (
    <>
      <div className="home">
        <h1>¡Feliz día del programador!</h1>
        <h3>Todo learnprog gratis por tiempo limitado</h3>
        <h4>
          ¡Gracias estudiantes y programadores por confiar en nosotros para
          enseñarles a construir el futuro!
        </h4>
        <h5>El tiempo gratis se termina en:</h5>
        <CountdownTimer targetDate={targetDate} />
        <button type="button">Aprovecha el tiempo</button>
        <p>*No necesitas tarjeta de credito</p>
      </div>
    </>
  );
};

export default Home;
