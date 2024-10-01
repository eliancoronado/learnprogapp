import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2"; // Asegúrate de instalar Chart.js y react-chartjs-2

const StudentEnrollmentChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios
      .get("/student-enrollment-data")
      .then((response) => {
        const { totalEstudiantes, totalMatriculados, noMatriculados } =
          response.data;
        setChartData({
          labels: ["Matriculados", "No Matriculados"],
          datasets: [
            {
              label: "Matriculación de Estudiantes",
              data: [totalMatriculados, noMatriculados],
              backgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos de matriculación:", error);
      });
  }, []);

  return (
    <div>
      <h2>Matrícula de Estudiantes</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default StudentEnrollmentChart;
