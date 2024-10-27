// PedidoDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PedidoDetail = () => {
  const { id } = useParams(); // Obtener el ID del pedido de los parámetros de la URL
  const [pedido, setPedido] = useState(null);
  const navigate = useNavigate(); // Para redireccionar

  useEffect(() => {
    const obtenerPedido = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/pedidos/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el pedido');
        }
        const data = await response.json();
        setPedido(data);
      } catch (error) {
        console.error('Error al obtener el pedido:', error);
      }
    };

    obtenerPedido();
  }, [id]); // Solo se ejecuta cuando el ID cambia

  if (!pedido) return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se obtiene el pedido

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>
        <h3 className="font-semibold">Cliente:</h3>
        <p>Nombre: {pedido.cliente.nombre} {pedido.cliente.apellido}</p>
        <p>DNI: {pedido.cliente.dni}</p>
        <p>Email: {pedido.cliente.email}</p>
        <p>Dirección: {pedido.cliente.direccion}</p>
        <h3 className="font-semibold mt-4">Productos:</h3>
        <ul>
          {pedido.productos.map((producto, index) => (
            <li key={index}>
              {producto.descripcion} - Cantidad: {producto.cantidad}
            </li>
          ))}
        </ul>
        <p className="font-bold mt-4">Total: ${pedido.total}</p>
        <button
          onClick={() => navigate(-1)} // Redirecciona a la página anterior
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PedidoDetail;
