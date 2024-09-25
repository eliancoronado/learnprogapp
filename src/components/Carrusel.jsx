import React, { useState, useEffect } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import "./Carrusel.css";

const Carrousel = () => {
  const [images, setImages] = useState([]);
  const [titles, setTitles] = useState([]);
  const [descs, setDescs] = useState([]);
  const [btns, setBtns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    fetch("https://api-backend-learnprog-p4pr.onrender.com/api/auth/cursos")
      .then((response) => response.json())
      .then((cursos) => {
        const fetchedImages = cursos.map((curso) => curso.image_url);
        setImages(fetchedImages);
        const fetchedTitles = cursos.map((curso) => curso.titulo);
        setTitles(fetchedTitles);
        const fetchedDescs = cursos.map((curso) => curso.descripcion);
        setDescs(fetchedDescs);
        const fetchedClaves = cursos.map((curso) => curso._id);
        setBtns(fetchedClaves);
      })
      .catch((error) => console.error("Error al obtener los cursos:", error));
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Detectar cuando el usuario toca la pantalla
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX); // Registrar la posición inicial del toque
  };

  // Detectar cuando el usuario mueve el dedo en la pantalla
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX); // Actualizar la posición del movimiento
  };

  // Detectar cuando el usuario suelta el dedo
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 30) {
      nextImage();
    }

    if (touchEndX - touchStartX > 30) {
      prevImage();
    }
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      className="course-page"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="background-blur"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
      />
      <div className="background-overlay" />{" "}
      {/* Nueva capa para el gradiente */}
      <div
        className="carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="carousel-image"
            />
          ))}
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
        <h1>{titles[currentIndex]}</h1>
        <p>{descs[currentIndex]}</p>
        <a href={`/curso/${btns[currentIndex]}`}>
          <button type="button">
            <FaRegCirclePlay /> Ver curso
          </button>
        </a>
      </div>
    </div>
  );
};

export default Carrousel;
