import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import './EstadisticasVentas.css';

const EstadisticasVentas = () => {
  // Datos de ejemplo de ventas por día
  const salesData = {
    labels: [
      '01', '02', '03', '04', '05', '06', '07', 
      '08', '09', '10', '11', '12', '13', '14', 
      '15', '16', '17', '18', '19', '20', '21', 
      '22', '23', '24', '25', '26', '27', '28', 
      '29', '30'
    ],
    datasets: [
      {
        label: 'Total Ventas ($)',
        data: [120, 150, 170, 200, 90, 220, 300, 250, 130, 190, 80, 400, 300, 220, 150, 100, 160, 180, 200, 210, 180, 150, 170, 230, 240, 200, 300, 320, 400, 450],
        backgroundColor: 'rgba(212, 175, 55, 0.6)', // Fondo dorado suave
        borderColor: 'rgba(212, 175, 55, 1)', // Borde dorado
        borderWidth: 2,
      },
    ],
  };

  const incomeData = {
    labels: [
      '01', '02', '03', '04', '05', '06', '07', 
      '08', '09', '10', '11', '12', '13', '14', 
      '15', '16', '17', '18', '19', '20', '21', 
      '22', '23', '24', '25', '26', '27', '28', 
      '29', '30'
    ],
    datasets: [
      {
        label: 'Total Ingresos ($)',
        data: [100, 120, 130, 180, 80, 200, 250, 230, 110, 160, 70, 350, 250, 180, 130, 90, 140, 160, 180, 190, 160, 130, 150, 200, 210, 180, 250, 270, 350, 400],
        backgroundColor: 'rgba(255, 215, 0, 0.6)', // Fondo dorado suave para ingresos
        borderColor: 'rgba(255, 215, 0, 1)', // Borde dorado
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total ($)',
          color: 'rgba(212, 175, 55, 1)', // Color dorado
        },
        ticks: {
          color: 'rgba(212, 175, 55, 1)', // Eje Y dorado
        },
        grid: {
          color: 'rgba(212, 175, 55, 0.2)', // Color de la cuadrícula dorada
        },
      },
      x: {
        title: {
          display: true,
          text: 'Días del Mes',
          color: 'rgba(212, 175, 55, 1)', // Color dorado
        },
        ticks: {
          color: 'rgba(212, 175, 55, 1)', // Eje X dorado
        },
        grid: {
          color: 'rgba(212, 175, 55, 0.2)', // Color de la cuadrícula dorada
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(212, 175, 55, 1)', // Color dorado para la leyenda
        },
      },
      tooltip: {
        bodyColor: 'rgba(212, 175, 55, 1)', // Color dorado para el texto del tooltip
        titleColor: 'rgba(212, 175, 55, 1)', // Color dorado para el título del tooltip
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(212, 175, 55, 0.6)', // Fondo dorado de las barras
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    // Aquí se establece el fondo negro del gráfico
    backgroundColor: 'rgba(0, 0, 0, 1)', // Fondo negro
  };

  // Ejemplo de datos informativos
  const cantidadVentas = 250; // Cambia esto según necesites
  const totalVentas = 4500;    // Cambia esto según necesites

  // Estado para manejar el gráfico actual
  const [showSales, setShowSales] = useState(true);

  return (
    <>
      <NavBar />
      <div className="container mt-0">
        <h1 className="text-center mb-4" style={{ color: 'rgba(212, 175, 55, 1)' }}>Ventas Diarias en el Mes</h1>
        <div className="mb-4 d-flex justify-content-between">
          <div className="info-box flex-fill mr-2">
            <div className="info-title">Cantidad de Ventas</div>
            <div className="info-value">{cantidadVentas}</div>
          </div>
          <div className="info-box flex-fill ml-2">
            <div className="info-title">Total en Ventas ($)</div>
            <div className="info-value">{totalVentas}</div>
          </div>
        </div>

        {/* Botones para seleccionar y filtrar */}
        <div className="mb-4 d-flex justify-content-center">
          <button 
            className={`btn ${showSales ? 'btn-primary' : 'btn-outline-primary'} mx-2`} 
            style={{ width: '200px' }} 
            onClick={() => setShowSales(true)}
          >
            Cantidad de Ventas
          </button>
          <button 
            className={`btn ${!showSales ? 'btn-secondary' : 'btn-outline-secondary'} mx-2`} 
            style={{ width: '200px' }} 
            onClick={() => setShowSales(false)}
          >
            Cantidad de Ingresos
          </button>
        </div>

        <div className="card chart-container">
          <div className="card-body">
            <Bar data={showSales ? salesData : incomeData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EstadisticasVentas;
