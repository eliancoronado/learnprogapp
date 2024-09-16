import React, { useState, useEffect } from "react";
import "./Courses.css";

const Courses = () => {
  const [images, setImages] = useState([]);
  const [btns, setBtns] = useState([]); // Cambié el nombre para mejor semántica

  useEffect(() => {
    fetch("http://localhost:4000/api/cursos")
      .then((response) => response.json())
      .then((cursos) => {
        if (cursos) {
          const fetchedImages = cursos.map((curso) => curso.image_url); // Extraer las URLs de imágenes
          setImages(fetchedImages); // Guardarlas en el estado
          const fetchedClaves = cursos.map((curso) => curso.clave); // Extraer las claves
          setBtns(fetchedClaves); // Guardarlas en el estado
        }
      })
      .catch((error) => console.error("Error al obtener los cursos:", error));
  }, []);

  return (
    <>
      <div className="courses-page-mini">
        {images.map((image, index) => (
          <a key={index} href={`/curso?=${btns[index]}`}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="course-image"
            />
          </a>
        ))}
      </div>
    </>
  );
};

export default Courses;
