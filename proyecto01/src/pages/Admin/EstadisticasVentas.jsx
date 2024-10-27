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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
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
        },
      },
      x: {
        title: {
          display: true,
          text: 'Días del Mes',
        },
      },
    },
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
        <h1 className="text-center mb-4">Ventas Diarias en el Mes</h1>
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
