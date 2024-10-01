import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useParams } from "react-router-dom";

// Registrar los elementos de Chart.js que se van a utilizar
ChartJS.register(ArcElement, Tooltip, Legend);

const StudentEnrollmentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();
  const courseId = id;
  console.log(courseId);

  useEffect(() => {
    axios
      .get(
        `https://api-backend-learnprog-p4pr.onrender.com/api/auth/student-data/${courseId}`
      ) // Enviar el ID del curso como parámetro
      .then((response) => {
        const data = response.data;
        if (
          data &&
          data.totalEstudiantes !== undefined &&
          data.totalMatriculados !== undefined
        ) {
          setChartData({
            labels: ["Matriculados", "No Matriculados"],
            datasets: [
              {
                label: "Estudiantes",
                data: [data.totalMatriculados, data.totalEstudiantes],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB"],
              },
            ],
          });
        } else {
          setError("Datos de la API no válidos.");
        }
      })
      .catch((err) => {
        console.error("Error al obtener los datos de matriculación:", err);
        setError("Error al obtener los datos de matriculación");
      });
  }, [courseId]); // Agregar courseId como dependencia para ejecutar el useEffect cuando cambie

  // Manejo de errores
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Verifica que chartData no sea null antes de renderizar el gráfico
  if (!chartData) {
    return <div>Cargando...</div>;
  }

  // Opciones para personalizar el gráfico
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white", // Color blanco para las etiquetas de la leyenda
          font: {
            size: 14, // Tamaño de la fuente
            family: "Arial", // Fuente de la leyenda
          },
        },
      },
    },
  };

  return (
    <div className="graficosdona">
      <h2>Gráfico de Matriculación de Estudiantes</h2>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default StudentEnrollmentChart;
