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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-gold">Detalles del Pedido</h2>
        <div className="border-b border-gray-600 pb-4 mb-4">
          <h3 className="font-semibold text-lg text-gold">Cliente:</h3>
          <p className="text-gray-300">Nombre: {pedido.cliente.nombre} {pedido.cliente.apellido}</p>
          <p className="text-gray-300">DNI: {pedido.cliente.dni}</p>
          <p className="text-gray-300">Email: {pedido.cliente.email}</p>
          <p className="text-gray-300">Dirección: {pedido.cliente.direccion}</p>
        </div>
        
        {/* Nuevo campo de input para Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="block font-semibold text-lg text-gold mb-2">Provincia:</label>
          <input
            id="provincia"
            type="text"
            value={pedido.cliente.provincia || ''}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h3 className="font-semibold text-lg text-gold">Productos:</h3>
        <ul className="mb-4">
          {pedido.productos.map((producto, index) => (
            <li key={index} className="text-gray-300">
              {producto.descripcion} - <span className="font-semibold">Cantidad: {producto.cantidad}</span>
            </li>
          ))}
        </ul>
        
        <p className="font-bold text-xl mt-4">Total: <span className="text-gold">${pedido.total}</span></p>
        
        <button
          onClick={() => navigate(-1)} // Redirecciona a la página anterior
          className="mt-6 px-6 py-3 bg-black text-gold rounded-lg hover:bg-gray-700 transition duration-300 w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PedidoDetail;
