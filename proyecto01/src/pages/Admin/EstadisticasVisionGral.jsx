// Estadisticas.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import NavBar from './NavBar';
import './EstadisticasVisionGral.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Estadisticas = () => {
  const visitasData = {
    labels: ['Inicio', 'Carrito', 'Instagram', 'Productos', 'Añadidos al Carrito', 'Pedidos Realizados'],
    datasets: [
      {
        label: 'Visitas y Acciones',
        data: [1200, 300, 450, 600, 400, 250],
        backgroundColor: 'rgba(212, 175, 55, 0.8)',  // Color dorado
        borderColor: 'rgba(212, 175, 55, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 215, 0, 1)',  // Dorado más intenso en hover
        hoverBorderColor: 'rgba(255, 215, 0, 1)',
        borderRadius: 10, // Esquinas redondeadas
      },
    ],
  };
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'gold',  // Letras doradas
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'Estadísticas de Visitas y Acciones',
        color: 'gold',  // Título dorado
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'gold',  // Letras doradas en el eje Y
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          color: 'gold',  // Letras doradas en el eje X
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="estadisticas-container">
        <h1>Estadísticas</h1>
        <div className="filter-container">
          <label htmlFor="month">Filtrar por mes:</label>
          <select id="month" name="month" className="month-select">
            <option value="">Seleccionar mes</option>
            <option value="enero">Enero</option>
            <option value="febrero">Febrero</option>
            <option value="marzo">Marzo</option>
          </select>
        </div>
        <div className="estadisticas-chart">
          <Bar data={visitasData} options={options} />
        </div>
      </div>
    </>
  );
};

export default Estadisticas;
