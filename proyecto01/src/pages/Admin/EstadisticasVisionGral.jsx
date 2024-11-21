// Estadisticas.js
import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import ApiUrls from '../../components/ApiUrls';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Estadisticas = () => {
  const mesActual = new Date().getMonth() + 1; 

  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual.toString()); // Establece el mes seleccionado por defecto
  const [visitasData, setVisitasData] = useState(null);
  const anioActual = new Date().getFullYear(); 

  // Función para manejar la selección de mes y formatearlo
  const handleMonthChange = (event) => {
    const mes = event.target.value;
    const meses = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12",
    };
    setMesSeleccionado(meses[mes] || "");
  };

  useEffect(() => {
    if (mesSeleccionado) {
      console.log("El mes seleccionado es " + mesSeleccionado)
      console.log("Ahora vamos a obtener los datos")
      axios.get(ApiUrls.estadisticas, {
        params: {
          mes: mesSeleccionado ,
          anio : anioActual
        }
      })
      .then((response) => {
        const datos = response.data.data;

        console.log(datos)
        console.log("visitas " + datos.visitas)
  
        // Formatear los datos para el gráfico de barras
        const formattedData = {
          labels: [
            'Visitas', 
            'Visitas productos', 
            'Añadidos carrito', 
            'Visitas carrito', 
            'Pre pedidos', 
            'Pedidos realizados', 
            'Ventas concretadas', 
            'Visitas whatsapp'
          ],
          datasets: [
            {
              label: 'Visitas y Acciones',
              data: [
                datos.visitas,
                datos.visitasProductos,
                datos.anadidosCarrito,
                datos.visitasCarrito,
                datos.prepedidos,
                datos.pedidosRealizados,
                datos.cantVentas,
                datos.visitasWhatsapp
              ],
              backgroundColor: 'rgba(212, 175, 55, 0.8)',  // Color dorado
              borderColor: 'rgba(212, 175, 55, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255, 215, 0, 1)',  // Dorado más intenso en hover
              hoverBorderColor: 'rgba(255, 215, 0, 1)',
              borderRadius: 10,
            },
          ],
        };
        setVisitasData(formattedData);
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
    }
  }, [mesSeleccionado]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'gold',
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'Estadísticas de Visitas y Acciones',
        color: 'gold',
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
          color: 'gold',
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          color: 'gold',
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
   
      <div className="estadisticas-container" style={{ marginTop: '180px' }}>
        <h1>Estadísticas</h1>
        <div className="filter-container">
          <label htmlFor="month">Filtrar por mes:</label>
          <select id="month" name="month" className="month-select" onChange={handleMonthChange}>
            <option value="">Seleccionar mes</option>
            <option value="enero">Enero</option>
            <option value="febrero">Febrero</option>
            <option value="marzo">Marzo</option>
            <option value="abril">Abril</option>
            <option value="mayo">Mayo</option>
            <option value="junio">Junio</option>
            <option value="julio">Julio</option>
            <option value="agosto">Agosto</option>
            <option value="septiembre">Septiembre</option>
            <option value="octubre">Octubre</option>
            <option value="noviembre">Noviembre</option>
            <option value="diciembre">Diciembre</option>
          </select>
        </div>
        <p>Mes seleccionado: {mesSeleccionado}</p>
        <div className="estadisticas-chart">
          {visitasData ? (
            <Bar data={visitasData} options={options} />
          ) : (
            <p>Selecciona un mes para ver los datos</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Estadisticas;
