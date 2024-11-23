import React, { useState } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import NavBar from '../pages/Admin/NavBar.jsx';

const ResumenFinanciero = () => {
  const [vistaMes, setVistaMes] = useState('Ultimos 5 meses'); // Vista predeterminada

  // Datos por mes
  const datosPorMes = {
    Enero: { ventas: 3000, gastos: 1500 },
    Febrero: { ventas: 2500, gastos: 1200 },
    Marzo: { ventas: 3200, gastos: 1700 },
    Abril: { ventas: 2800, gastos: 1400 },
    Mayo: { ventas: 3500, gastos: 1600 },
    Junio: { ventas: 2900, gastos: 1300 },
    Julio: { ventas: 3000, gastos: 1500 },
    Agosto: { ventas: 3400, gastos: 1800 },
    Septiembre: { ventas: 3100, gastos: 1600 },
    Octubre: { ventas: 3300, gastos: 1700 },
    Noviembre: { ventas: 2900, gastos: 1400 },
    Diciembre: { ventas: 3500, gastos: 1800 },
  };

  // Obtener los últimos 5 meses
  const obtenerUltimos5Meses = () => {
    const meses = Object.keys(datosPorMes);
    return meses.slice(-5); // Últimos 5 meses
  };

  const mesesAMostrar = vistaMes === 'Todos' ? Object.keys(datosPorMes) : obtenerUltimos5Meses();

  // Función para calcular el porcentaje de cambio
  const calcularVariacionPorcentual = (mesKey, balanceActual) => {
    const mesIndex = Object.keys(datosPorMes).indexOf(mesKey);
    if (mesIndex === 0) return null; // No hay mes anterior para el primer mes

    const mesAnterior = Object.keys(datosPorMes)[mesIndex - 1];
    const balanceAnterior = datosPorMes[mesAnterior].ventas - datosPorMes[mesAnterior].gastos;
    const variacion = ((balanceActual - balanceAnterior) / balanceAnterior) * 100;

    return variacion.toFixed(2); // Redondear a 2 decimales
  };

  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Container className="mt-4">
        <h2 className="text-center mb-4 text-dark">Resumen Financiero</h2>

        {/* Selector de vista */}
        <Form.Group className="mb-4">
          <Form.Label className="text-dark">Mostrar</Form.Label>
          <Form.Control
            as="select"
            value={vistaMes}
            onChange={(e) => setVistaMes(e.target.value)}
            className="bg-dark text-white border-0"
          >
            <option value="Ultimos 5 meses">Últimos 5 meses</option>
            <option value="Todos">Todos</option>
          </Form.Control>
        </Form.Group>

        {/* Tabla de resumen financiero con scroll horizontal */}
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <Table striped bordered hover className="text-dark">
            <thead className="bg-dark text-white">
              <tr>
                <th>Mes</th>
                <th>Ventas</th>
                <th>Gastos</th>
                <th>Balance</th>
                <th>Variación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesesAMostrar.map((mesKey) => {
                const { ventas, gastos } = datosPorMes[mesKey];
                const balance = ventas - gastos; // Calcular el balance
                const variacion = calcularVariacionPorcentual(mesKey, balance); // Calcular la variación porcentual
                const porcentaje = variacion !== null ? (variacion >= 0 ? `+${variacion}%` : `${variacion}%`) : '';

                return (
                  <tr key={mesKey}>
                    <td>{mesKey}</td>
                    <td>${ventas}</td>
                    <td>${gastos}</td>
                    <td>${balance}</td>
                    <td>{porcentaje}</td> {/* Mostrar la variación */}
                    <td className="d-flex">
                      <Button
                        variant="outline-warning"
                        className="me-2"
                        size="sm"
                        onClick={() => alert(`Agregar venta en ${mesKey}`)}
                      >
                        + Venta
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="me-2"
                        size="sm"
                        onClick={() => alert(`Agregar gasto en ${mesKey}`)}
                      >
                        + Gasto
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => alert(`Detalle de ${mesKey}`)}
                      >
                        Detalle
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default ResumenFinanciero;
