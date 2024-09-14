import React from "react";
import "./NCourses.css";
import CountdownTimer from "../../components/Counter";

const NCourses = () => {
  const targetDate = "2025-01-01T00:00:00";
  return (
    <>
      <div className="ncourses">
        <div className="ncrswr">
          <img
            src="https://i.postimg.cc/HWy84G8L/Frame-1-11.png"
            width="100%"
          />
          <div className="prx">Proximo Curso</div>
          <h1>Curso de EXElearning desde cero (2024)</h1>
          <p>
            Este curso de eXeLearning está diseñado para principiantes que
            desean crear y publicar contenidos educativos en formato web.
          </p>
          <h5>Comenzamos en:</h5>
          <CountdownTimer targetDate={targetDate} />
        </div>
      </div>
    </>
  );
};

export default NCourses;
