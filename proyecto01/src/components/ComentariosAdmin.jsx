import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import NavBar from '../pages/Admin/NavBar.jsx';
import ApiUrls from './ApiUrls.jsx';

const ComentariosAdmin = () => {
  const [comentarios, setComentarios] = useState([]);
  const [comentariosOrdenados, setComentariosOrdenados] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
        try {
          const response = await fetch(ApiUrls.productos);
          if (!response.ok) throw new Error('Error al obtener los productos');
          const data = await response.json();
      
          const todosLosComentarios = data.flatMap(producto => 
            (producto.comentarios || []).map(comentario => ({
              ...comentario, 
              idProducto: producto._id,  
              nombreProducto: producto.nombre,  
              fechaCompleta: new Date(`${comentario.fecha}T${comentario.hora}`) 
            }))
          );
      
          console.log("Todos los comentarios ", todosLosComentarios);
      
      
          const comentariosOrdenados = todosLosComentarios.sort((a, b) => b.fechaCompleta - a.fechaCompleta);
          
          setComentarios(todosLosComentarios);
          setComentariosOrdenados(comentariosOrdenados); 
        } catch (error) {
          console.error('Error:', error);
        }
      };
      

    fetchComentarios();
  }, []);

  const manejarAccion = (id, accion) => {
    if (accion === 'aprobar') {
      alert(`Comentario ${id} aprobado`);
    } else if (accion === 'eliminar') {
      alert(`Comentario ${id} eliminado`);
    }
    setComentariosOrdenados(comentariosOrdenados.filter((comentario) => comentario.id !== id));
  };

  const verDetalle = (comentario) => {
    setComentarioSeleccionado(comentario);
    setShowModal(true);
  };

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '150px' }}>
        <h2 className="text-center mb-4 text-dark">Comentarios Pendientes</h2>
        <div className="table-responsive">
          <Table striped bordered hover className="text-center align-middle">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID Producto</th>
                <th>Nombre Producto</th>
                <th>Fecha y Hora</th>
                <th>Autor</th>
                <th>Email</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentariosOrdenados.length > 0 ? (
                comentariosOrdenados.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>{comentario.idProducto}</td>
                    <td>{comentario.nombreProducto}</td>
                    <td>{comentario.fecha}</td>
                    <td>{comentario.nombre}</td>
                    <td>{comentario.email}</td>
                    <td className="text-start text-truncate" style={{ maxWidth: '200px' }}>
                      {comentario.comentario}
                    </td>
                    <td>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={() => manejarAccion(comentario.id, 'aprobar')}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        className="me-2"
                        onClick={() => manejarAccion(comentario.id, 'eliminar')}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="info"
                        onClick={() => verDetalle(comentario)}
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay comentarios pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* Modal para mostrar detalles */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Comentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comentarioSeleccionado && (
            <>
              <p>
                <strong>ID Producto:</strong> {comentarioSeleccionado.idProducto}
              </p>
              <p>
                <strong>Nombre Producto:</strong> {comentarioSeleccionado.nombreProducto}
              </p>
              <p>
                <strong>Fecha y Hora:</strong> {comentarioSeleccionado.fecha}
              </p>
              <p>
                <strong>Autor:</strong> {comentarioSeleccionado.nombre}
              </p>
              <p>
                <strong>Email:</strong> {comentarioSeleccionado.email}
              </p>
              <p>
                <strong>Comentario:</strong> {comentarioSeleccionado.comentario}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ComentariosAdmin;
