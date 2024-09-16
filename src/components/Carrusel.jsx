import React, { useState, useEffect } from "react";
import "./Carrusel.css"; // Asegúrate de importar el archivo CSS

const Carrousel = () => {
  const [images, setImages] = useState([]);
  const [titles, setTitles] = useState([]);
  const [descs, setDescs] = useState([]);
  const [btns, setBtns] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(0);
  const [currentBtn, setCurrentBtn] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/cursos")
      .then((response) => response.json())
      .then((cursos) => {
        if (cursos) {
          const fetchedImages = cursos.map((curso) => curso.image_url); // Extraer las URLs de imágenes
          setImages(fetchedImages); // Guardarlas en el estado
          const fetchedTitles = cursos.map((curso) => curso.titulo); // Extraer las URLs de imágenes
          setTitles(fetchedTitles); // Guardarlas en el estado
          const fetchedDecs = cursos.map((curso) => curso.descripcion); // Extraer las URLs de imágenes
          setDescs(fetchedDecs); // Guardarlas en el estado
          const fetchedClaves = cursos.map((curso) => curso.clave); // Extraer las URLs de imágenes
          setBtns(fetchedClaves); // Guardarlas en el estado
        }
      })
      .catch((error) => console.error("Error al obtener los cursos:", error));
  }, []);

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
  }, [currentIndex, currentTitle, currentText, currentBtn]);

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
