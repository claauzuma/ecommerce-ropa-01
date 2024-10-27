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
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.6)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
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
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'Estadísticas de Visitas y Acciones',
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
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
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
            {/* Agrega más opciones de meses según sea necesario */}
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
