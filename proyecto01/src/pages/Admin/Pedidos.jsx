import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [tipo, setTipo] = useState('pendiente');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pedidos');
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };


    obtenerPedidos();

    const interval = setInterval(() => {
      obtenerPedidos();
    }, 20000);


    return () => clearInterval(interval);
  }, []); 

  const sumarIngreso = async (id) => {
    try {
      const pedidoResponse = await axios.get(`http://localhost:8080/api/pedidos/${id}`);
      const ingresoPedido = pedidoResponse.data.total;

      await axios.post('http://localhost:8080/api/estadisticas', {
        tipoEvento: 'ingreso',
        datos: {
          fecha: new Date().toISOString().split('T')[0],
          ingresoTotal: ingresoPedido,
        },
      });

      console.log(`Ingreso de $${ingresoPedido} agregado a las estadísticas.`);
    } catch (error) {
      console.error('Error al sumar el ingreso del pedido:', error);
    }
  };

  const handlePedidoDetail = (id) => {
    navigate(`/pedido/detail/${id}`);
  };

  const confirmarPedido = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'confirmado' }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pedido');
      }

      const updatedPedidos = pedidos.map((pedido) =>
        pedido._id === id ? { ...pedido, estado: 'confirmado' } : pedido
      );
      setPedidos(updatedPedidos);

      sumarIngreso(id);
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    }
  };

  const despacharPedido = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ despachado: true }),
      });

      if (!response.ok) {
        throw new Error('Error al despachar el pedido');
      }

      const updatedPedidos = pedidos.map((pedido) =>
        pedido._id === id ? { ...pedido, despachado: true } : pedido
      );
      setPedidos(updatedPedidos);

      console.log('Pedido despachado:', id);
    } catch (error) {
      console.error('Error al despachar el pedido:', error);
    }
  };

  const eliminarPedido = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
      }

      // Filtra el pedido eliminado del estado actual
      const updatedPedidos = pedidos.filter((pedido) => pedido._id !== id);
      setPedidos(updatedPedidos);

      console.log('Pedido eliminado:', id);
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const pedidosFiltrados = tipo === 'todos'
    ? pedidos
    : pedidos.filter((pedido) =>
        tipo === 'confirmado'
          ? pedido.estado === 'confirmado' && !pedido.despachado
          : pedido.estado === 'pendiente'
      );

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Pedidos</h2>
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => setTipo('confirmado')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'confirmado' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Pedidos Confirmados
          </button>
          <button
            onClick={() => setTipo('pendiente')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'pendiente' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Pedidos Pendientes
          </button>
          <button
            onClick={() => setTipo('todos')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'todos' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Todos los Pedidos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg bg-gray-50 w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border-b px-4 py-2">ID</th>
                <th className="border-b px-4 py-2">Cliente</th>
                <th className="border-b px-4 py-2">Total</th>
                <th className="border-b px-4 py-2">Estado</th>
                <th className="border-b px-4 py-2">Fecha de Creación</th>
                <th className="border-b px-4 py-2">Hora de Creación</th>
                <th className="border-b px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No hay pedidos disponibles</td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido._id} className="hover:bg-gray-100 transition duration-200">
                    <td className="border-b px-4 py-2 text-gray-800">{pedido._id}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
                    <td className="border-b px-4 py-2 text-gray-800">${pedido.total}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.estado}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.fechaCreacion}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.horaCreacion}</td>
                    <td className="border-b px-4 py-2 flex space-x-2">
                      {pedido.estado !== 'confirmado' && (
                        <button
                          onClick={() => confirmarPedido(pedido._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        onClick={() => handlePedidoDetail(pedido._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        Detalle
                      </button>
                      {pedido.estado === 'confirmado' && !pedido.despachado && (
                        <button
                          onClick={() => despacharPedido(pedido._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                        >
                          Despachar
                        </button>
                      )}
                      {pedido.estado === 'pendiente' && (
                        <button
                          onClick={() => eliminarPedido(pedido._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Pedidos;
