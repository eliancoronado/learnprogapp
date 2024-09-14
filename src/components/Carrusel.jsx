import React, { useState, useEffect } from "react";
import "./Carrusel.css"; // Asegúrate de importar el archivo CSS

const images = [
  "https://i.postimg.cc/Z5YC1vQ0/css.png",
  "https://i.postimg.cc/DyBnFP8f/mit-2.png",
  "https://i.postimg.cc/FsCMdZSP/Figma.png",
  "https://i.postimg.cc/HWy84G8L/Frame-1-11.png",
];

const Carrousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para cambiar a la imagen siguiente
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para cambiar a la imagen anterior
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Efecto para cambiar automáticamente la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(nextImage, 3000); // Cambia cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte o cuando se actualice
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
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
          className={`carousel-image ${index === currentIndex ? "active" : ""}`}
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
  );
};

export default Carrousel;
