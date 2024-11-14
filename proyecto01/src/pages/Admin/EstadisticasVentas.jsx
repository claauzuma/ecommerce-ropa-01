import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import './EstadisticasVentas.css';
import axios from 'axios';

const EstadisticasVentas = () => {
    const [dataSales, setDataSales] = useState(new Array(31).fill(0)); // Inicializa con ceros
    const [dataIncome, setDataIncome] = useState(new Array(31).fill(0)); // Inicializa con ceros
    const [cantidadVentas, setCantidadVentas] = useState(0); // Nuevo estado para cantidad de ventas
    const [totalVentas, setTotalVentas] = useState(0); // Nuevo estado para total en ventas

    // Obtener el mes actual (0 para enero, 1 para febrero, ..., 11 para diciembre)
    const mesSeleccionado = new Date().getMonth() + 1; // +1 para que sea del 1 al 12

    useEffect(() => {
        const fetchSalesData = async () => {
            const updatedDataSales = [...dataSales]; // Crea una copia del estado actual
            const updatedDataIncome = [...dataIncome]; // Crea una copia del estado actual

            let totalVentasSum = 0; // Acumulador para totalVentas
            let cantidadVentasSum = 0; // Acumulador para cantidadVentas

            try {
                for (let dia = 1; dia <= 31; dia++) {
                    // Formatear el día para que sea un número de dos dígitos
                    const diaFormateado = String(dia).padStart(2, '0');

                    const response = await axios.get(`http://localhost:8080/api/estadisticas`, {
                        params: {
                            mes: mesSeleccionado,
                            dia: diaFormateado, // Envía el día como parámetro
                        },
                    });

                    const totalVendido = response.data.data.totalVendido || 0; // Asegúrate que exista
                    const cantVentas = response.data.data.cantVentas || 0; // Maneja el caso en que no haya datos

                    // Actualiza el valor correspondiente en updatedDataSales
                    updatedDataSales[dia - 1] = cantVentas; // Almacena el valor en la posición correspondiente
                    updatedDataIncome[dia - 1] = totalVendido;

                    // Suma a los acumuladores
                    totalVentasSum += totalVendido;
                    cantidadVentasSum += cantVentas;
                }

                setDataSales(updatedDataSales);
                setDataIncome(updatedDataIncome);
                setCantidadVentas(cantidadVentasSum); // Actualiza el estado de cantidadVentas
                setTotalVentas(totalVentasSum); // Actualiza el estado de totalVentas

            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, [mesSeleccionado]); // Agrega mesSeleccionado como dependencia

    const salesData = {
        labels: [
            '01', '02', '03', '04', '05', '06', '07',
            '08', '09', '10', '11', '12', '13', '14',
            '15', '16', '17', '18', '19', '20', '21',
            '22', '23', '24', '25', '26', '27', '28',
            '29', '30', '31', // Agregar el 31
        ],
        datasets: [
            {
                label: 'Total Ventas ($)',
                data: dataSales, // Utiliza el estado actualizado
                backgroundColor: 'rgba(212, 175, 55, 0.6)', // Fondo dorado suave
                borderColor: 'rgba(212, 175, 55, 1)', // Borde dorado
                borderWidth: 2,
            },
        ],
    };

    const incomeData = {
        labels: salesData.labels,
        datasets: [
            {
                label: 'Total Ingresos ($)',
                data: dataIncome,
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
        backgroundColor: 'rgba(0, 0, 0, 1)', // Fondo negro
    };

    // Estado para manejar el gráfico actual
    const [showSales, setShowSales] = useState(true);

    return (
        <>
            <NavBar />
            <br /> <br /> <br /> <br />
            <div className="container mt-0">
                <br />
                <div className="mb-4 d-flex justify-content-between">
                    <div className="info-box flex-fill mr-2">
                        <div className="info-title">Cantidad de Ventas</div>
                        <div className="info-value">{cantidadVentas}</div> {/* Ahora muestra el total */}
                    </div>
                    <div className="info-box flex-fill ml-2">
                        <div className="info-title">Total en Ventas ($)</div>
                        <div className="info-value">{totalVentas}</div> {/* Ahora muestra el total */}
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
