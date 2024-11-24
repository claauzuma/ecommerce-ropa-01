import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Form, Modal, Row, Col } from 'react-bootstrap';
import NavBar from '../pages/Admin/NavBar.jsx';
import ApiUrls from './ApiUrls.jsx';
import Select from 'react-select';

const ResumenFinanciero = () => {
  const [vistaMes, setVistaMes] = useState('Ultimos 5 meses');
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [productos, setProductos] = useState([]);  // Lista original de productos desde la API
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ nombre: '', talle: '', color: '', cantidad: '' }]); // Inicializar con un producto vacío
  const [productoElegido, setProductoElegido] = useState();
  const [talleElegido, setTalleElegido] = useState();
  const [colorElegido, setColorElegido] = useState();
 

  const [gastos, setGastos] = useState([{ detalle: '', cantidad: '', valor: '' }]);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [showDetalleModal, setShowDetalleModal] = useState(false); // Estado para manejar el modal de detalle

  // Datos de ejemplo para los meses
  const datosPorMes = {
    Enero: { ventas: 3000, gastos: 1500 },
    Febrero: { ventas: 2500, gastos: 1200 },
    Marzo: { ventas: 3200, gastos: 1700 },
    Abril: { ventas: 2900, gastos: 1400 },
    Mayo: { ventas: 3100, gastos: 1600 },
    Junio: { ventas: 2800, gastos: 1300 },
    Julio: { ventas: 3000, gastos: 1500 },
    Agosto: { ventas: 3200, gastos: 1800 },
    Septiembre: { ventas: 3400, gastos: 2000 },
    Octubre: { ventas: 3500, gastos: 2100 },
    Noviembre: { ventas: 3600, gastos: 2200 },
  };

  const obtenerUltimos5Meses = () => {
    const mesesOrdenados = Object.keys(datosPorMes);
    return mesesOrdenados.slice(-5);
  };

  const obtenerMesesHastaFechaActual = () => {
    const mesesOrdenados = Object.keys(datosPorMes);
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // Índice del mes actual (0 = Enero, 1 = Febrero, etc.)
    return mesesOrdenados.slice(0, mesActual + 1);  // Incluir el mes actual
  };

  const mesesAMostrar = vistaMes === 'Todos' ? obtenerMesesHastaFechaActual() : obtenerUltimos5Meses();

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${ApiUrls.productos}`);
        const data = await response.json();
        setProductos(data);  // Cargar productos originales
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleProductoSeleccionado = (selectedProductName) => {
    const productoSeleccionado = productos.find(
      (prod) => prod.nombre === selectedProductName
    );
    console.log("El producto seleccionado es ", productoSeleccionado)
    
    // Setear el producto en el estado productoElegido
    setProductoElegido(productoSeleccionado);
  };
  

  // Funciones para manejar productos seleccionados
  const handleAgregarProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, { nombre: '', talle: '', color: '', cantidad: '' }]);
  };

  const handleEliminarProducto = (index) => {
    const nuevosProductos = productosSeleccionados.filter((_, i) => i !== index);
    setProductosSeleccionados(nuevosProductos);
  };

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productosSeleccionados]; // Creamos una copia del array
    nuevosProductos[index][field] = value; // Actualizamos el campo específico (talle, color, etc.)
    setProductosSeleccionados(nuevosProductos); // Actualizamos el estado
  };
  

  const handleGuardarVenta = () => {
    console.log(`Productos guardados para ${mesSeleccionado}:`, productosSeleccionados);
    setShowVentaModal(false);
    setProductosSeleccionados([]);  // Limpiar después de guardar
  };

  const handleVerDetalle = (mes) => {
    setMesSeleccionado(mes);
    setShowDetalleModal(true); // Mostrar modal de detalle
  };

  return (
    <>
      <NavBar />
      <br />
      <Container className="mt-5 pt-5 pb-5">
        <h2 className="text-center mb-4 text-dark">Resumen Financiero</h2>

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

        <Table striped bordered hover className="text-dark">
          <thead className="bg-dark text-white">
            <tr>
              <th>Mes</th>
              <th>Ventas</th>
              <th>Gastos</th>
              <th>Balance</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesesAMostrar.map((mesKey) => {
              const { ventas, gastos } = datosPorMes[mesKey];
              const balance = ventas - gastos;

              return (
                <tr key={mesKey}>
                  <td>{mesKey}</td>
                  <td>${ventas}</td>
                  <td>${gastos}</td>
                  <td>${balance}</td>
                  <td className="d-flex">
                    <Button
                      variant="outline-warning"
                      className="me-2"
                      size="sm"
                      onClick={() => { setShowVentaModal(true); setMesSeleccionado(mesKey); }}
                    >
                      + Venta
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="me-2"
                      size="sm"
                      onClick={() => { setShowGastoModal(true); setMesSeleccionado(mesKey); }}
                    >
                      + Gasto
                    </Button>
                    <Button
                      variant="outline-info"
                      className="me-2"
                      size="sm"
                      onClick={() => handleVerDetalle(mesKey)} // Mostrar modal de detalle
                    >
                      Detalle
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      {/* Modal para agregar productos */}
      <Modal show={showVentaModal} onHide={() => setShowVentaModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Venta - {mesSeleccionado}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productosSeleccionados.map((producto, index) => (
            <Row key={index} className="mb-3">
 <Col>
  <Select
    options={productos.map((prod) => ({ value: prod.nombre, label: prod.nombre }))}
    value={{ value: productoElegido?.nombre || '', label: productoElegido?.nombre || '' }} // Si no hay un producto elegido, mostramos vacío
    onChange={(selectedOption) => handleProductoSeleccionado(selectedOption.value)} // Llamamos a la función para setear el producto
    placeholder="Seleccionar producto"
  />
</Col>
<Col>
  <Select
    options={productoElegido?.talles?.map((item) => ({ value: item.talle, label: item.talle })) || []}
    value={{ value: producto.talle, label: producto.talle }} // Asegúrate de que el valor esté correctamente asignado
    onChange={(selectedOption) => handleProductoChange(index, 'talle', selectedOption.value)} // Usamos selectedOption.value
    placeholder="Seleccionar talle"
  />
</Col>



              <Col>
                <Form.Control
                  placeholder="Color"
                  value={producto.color}
                  onChange={(e) => handleProductoChange(index, 'color', e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Cantidad"
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button variant="danger" onClick={() => handleEliminarProducto(index)}>
                  Eliminar
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="success" onClick={handleAgregarProducto}>
            + Agregar otro producto
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVentaModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleGuardarVenta}>
            Guardar Venta
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver detalles */}

<Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Detalle de {mesSeleccionado}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {datosPorMes[mesSeleccionado] ? ( // Verificar si el mes existe
      <>
        <h5>Detalles de ventas y gastos para {mesSeleccionado}</h5>
        <p>Ventas: ${datosPorMes[mesSeleccionado].ventas}</p>
        <p>Gastos: ${datosPorMes[mesSeleccionado].gastos}</p>
        <p>Balance: ${datosPorMes[mesSeleccionado].ventas - datosPorMes[mesSeleccionado].gastos}</p>
      </>
    ) : (
      <p>No se encontraron datos para el mes seleccionado.</p> // Mensaje en caso de que no haya datos
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default ResumenFinanciero;
