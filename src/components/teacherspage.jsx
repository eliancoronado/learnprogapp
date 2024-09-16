import React from "react";
import "./teacherspage.css";

const Teacherspage = () => {
  return (
    <>
      <div className="teacherpage">
        <h1>Profesores</h1>
        <div className="tchrsimgwr">
          <a href="/johan">
            <div className="tchrop">
              <img
                src="https://i.postimg.cc/3x6Fx271/Whats-App-Image-2024-09-16-at-1-50-45-PM.jpg"
                alt=""
              />
              <h3>Johan Mendoza</h3>
            </div>
          </a>
          <a href="/heydi">
            <div className="tchrop">
              <img
                src="https://i.postimg.cc/pXZpCjdZ/Whats-App-Image-2024-09-16-at-2-18-51-PM.jpg"
                alt=""
              />
              <h3>Heydi Ramos</h3>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Teacherspage;
