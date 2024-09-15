import React, { useState, useEffect } from "react";
import "./Carrusel.css"; // Asegúrate de importar el archivo CSS

const images = [
  "https://i.postimg.cc/Z5YC1vQ0/css.png",
  "https://i.postimg.cc/DyBnFP8f/mit-2.png",
  "https://i.postimg.cc/FsCMdZSP/Figma.png",
  "https://i.postimg.cc/HWy84G8L/Frame-1-11.png",
];
const titles = [
  "Curso de CSS desde cero (2024)",
  "Curso de App Inventor 2 desde cero (2024)",
  "Curso de Figma desde cero (2024)",
  "Curso de ExeLearning desde cero (2024)",
];
const descs = [
  "Domina el lenguaje que hace hermosa la web con el MEJOR CURSO EN ESPAÑOL.",
  "Creación de aplicaciones móviles impactantes, sin necesidad de experiencia previa en programación.",
  "Explora el mundo del diseño de interfaces con nuestro curso de UX/UI usando Figma.",
  "Este curso de eXeLearning está diseñado para principiantes que desean crear y publicar contenidos educativos en formato web.",
];
const btns = ["curso1", "curso2", "curso3", "curso4"];

const Carrousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(0);
  const [currentBtn, setCurrentBtn] = useState(0);

  // Función para cambiar a la imagen siguiente
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentText((prevText) =>
      prevText === descs.length - 1 ? 0 : prevText + 1
    );
    setCurrentTitle((prevTitle) =>
      prevTitle === titles.length - 1 ? 0 : prevTitle + 1
    );
    setCurrentBtn((prevBtn) => (prevBtn === btns.length - 1 ? 0 : prevBtn + 1));
  };

  // Función para cambiar a la imagen anterior
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setCurrentText((prevText) =>
      prevText === 0 ? descs.length - 1 : prevText - 1
    );
    setCurrentTitle((prevTitle) =>
      prevTitle === 0 ? titles.length - 1 : prevTitle - 1
    );
    setCurrentBtn((prevBtn) => (prevBtn === 0 ? btns.length - 1 : prevBtn - 1));
  };

  // Efecto para cambiar automáticamente la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(nextImage, 3000); // Cambia cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte o cuando se actualice
    return () => clearInterval(interval);
  }, [currentIndex, currentText, currentTitle, currentBtn]);

  return (
    <div className="course-page">
      <div
        className="carousel-container"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backdropFilter: "blur(50px)",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`carousel-image ${
              index === currentIndex ? "active" : ""
            }`}
          />
        ))}

        <div className="carousel-buttons">
          <button onClick={prevImage} className="carousel-button">
            ❮
          </button>
          <button onClick={nextImage} className="carousel-button">
            ❯
          </button>
        </div>

        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="corstxt">
        <div className="prx">Tendencias</div>
        <h1>{titles[currentTitle]}</h1>
        <p>{descs[currentText]}</p>
        <a href={`/curso?=${btns[currentBtn]}`}>
          <button type="button">Ver curso</button>
        </a>
      </div>
    </div>
  );
};
export default Carrousel;
