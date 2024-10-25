import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: 'Juan', productos: ['Producto 1', 'Producto 2'], total: 50, estado: 'confirmado', fechaCreacion: new Date() },
    { id: 2, cliente: 'María', productos: ['Producto 3', 'Producto 4'], total: 75, estado: 'reservado', fechaCreacion: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    { id: 3, cliente: 'Carlos', productos: ['Producto 5'], total: 25, estado: 'confirmado', fechaCreacion: new Date() },
    { id: 4, cliente: 'Ana', productos: ['Producto 6', 'Producto 7'], total: 100, estado: 'reservado', fechaCreacion: new Date(Date.now() - 36 * 60 * 60 * 1000) },
  ]);

  const [tipo, setTipo] = useState('todos');

  const pedidosFiltrados = tipo === 'todos'
    ? pedidos
    : pedidos.filter(pedido => pedido.estado === tipo);

  const confirmarPedido = (id) => {
    const nuevosPedidos = pedidos.map(pedido => {
      if (pedido.id === id) {
        return { ...pedido, estado: 'confirmado' };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  useEffect(() => {
    const eliminarPedidosNoConfirmados = () => {
      const ahora = new Date();
      const nuevosPedidos = pedidos.filter(pedido => {
        const diferencia = ahora - new Date(pedido.fechaCreacion);
        return !(pedido.estado === 'reservado' && diferencia > 24 * 60 * 60 * 1000);
      });
      setPedidos(nuevosPedidos);
    };

    eliminarPedidosNoConfirmados();
    const intervalo = setInterval(eliminarPedidosNoConfirmados, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, [pedidos]);

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <NavBar />
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Pedidos</h2>
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => setTipo('confirmado')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'confirmado' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Pedidos Confirmados
          </button>
          <button
            onClick={() => setTipo('reservado')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'reservado' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Pedidos Reservados
          </button>
          <button
            onClick={() => setTipo('todos')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${tipo === 'todos' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'}`}
          >
            Todos los Pedidos
          </button>
        </div>

        {/* Contenedor para scroll horizontal */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg bg-gray-50">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border-b px-4 py-2">ID</th>
                <th className="border-b px-4 py-2">Cliente</th>
                <th className="border-b px-4 py-2">Total</th>
                <th className="border-b px-4 py-2">Estado</th>
                <th className="border-b px-4 py-2">Fecha de Creación</th>
                <th className="border-b px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No hay pedidos disponibles</td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.id}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.cliente}</td>
                    <td className="border-b px-4 py-2 text-gray-800">${pedido.total}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{pedido.estado}</td>
                    <td className="border-b px-4 py-2 text-gray-800">{formatearFecha(new Date(pedido.fechaCreacion))}</td>
                    <td className="border-b px-4 py-2 flex space-x-2">
                      {/* Mostrar el botón Confirmar solo si el estado no es 'confirmado' */}
                      {pedido.estado !== 'confirmado' && (
                        <button
                          onClick={() => confirmarPedido(pedido.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        onClick={() => console.log('Detalle pedido:', pedido)}
                      >
                        Detalle
                      </button>
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
