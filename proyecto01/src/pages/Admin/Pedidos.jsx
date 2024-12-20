import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pedidos.css'
import { Modal, Button } from "react-bootstrap";
import ApiUrls from '../../components/ApiUrls';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([])
  const [tipo, setTipo] = useState('pendiente');
  const navigate = useNavigate();
  const [originalImages, setOriginalImages] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    price: '',
    tallesInputs: [{ talle: '', colores: [{ color: '', stock: '' }] }],
    categoria: '',
    images: [], 
    originalImages: [], 
  });

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch(ApiUrls.pedidos);
        const responseProd = await axios.get(ApiUrls.productos);
        const data = await response.json();
        setPedidos(data);
        setProductos(responseProd.data);
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
      const pedidoResponse = await axios.get(`${ApiUrls.pedidos}/${id}`);

      const ingresoPedido = pedidoResponse.data.total;

      await axios.post(ApiUrls.estadisticas, {
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


  const verificarStock = (producto) => {
    let hayStock = true;
    const productoBuscado = productos.find(prod => prod.nombre === producto.nombre);
    if (!productoBuscado) return false;
    const talleBuscado = productoBuscado.talles.find(talle => talle.talle === producto.talle);
    if (!talleBuscado) return false;
    const colorBuscado = talleBuscado.colores.find(color => color.color === producto.color);
    if (!colorBuscado) return false;
  
    console.log("Comparamos los colores")
    console.log("Color buscado " , colorBuscado.stock)
    console.log("Cantidad de producto del pedido con ese color" , producto.cantidad)
    if (colorBuscado.stock < producto.cantidad) {
      hayStock = false;
    }
    console.log(hayStock)
    return hayStock;
  };

  const hayStock = async (pedido) => {

    let i = 0;
    let stock = true;
  
    while (i < pedido.productos.length && stock) {
      const productoActual = pedido.productos[i];
      if (verificarStock(productoActual) == false) {
        console.log("El stock pasa a ser falso ya que no hay stock suficiente")
        stock = false; 
      }
      i += 1;
    }

    return stock;
  };



  const descontarStockDeProducto = async (producto) => {
    console.log("Vamos a buscar el producto para descontar el stock de: " + producto.nombre);
  
    const productoEncontrado = productos.find((prod) => prod.nombre === producto.nombre);
    console.log("Producto encontrado:", productoEncontrado);
  
    if (productoEncontrado) {

      const talle = productoEncontrado.talles.find((talle) => talle.talle === producto.talle);
  
      if (talle) {

        const color = talle.colores.find((color) => color.color === producto.color);
  
        if (color && color.stock >= producto.cantidad) {
          console.log("Stock antes de descontar:", color.stock);

          color.stock -= producto.cantidad;
          console.log("Stock después de descontar:", color.stock);
  

          const formDataToSend = new FormData();
          formDataToSend.append('nombre', productoEncontrado.nombre);
          formDataToSend.append('descripcion', productoEncontrado.descripcion);
          formDataToSend.append('categoria', productoEncontrado.categoria);
          formDataToSend.append('price', productoEncontrado.price);
  

          if (productoEncontrado.images && productoEncontrado.images.length > 0) {
            productoEncontrado.images.forEach((image) => {
              formDataToSend.append('images', image);
            });
          } else {
            formDataToSend.append('originalImages', JSON.stringify(productoEncontrado.images || []));
          }

          formDataToSend.append('tallesInputs', JSON.stringify(productoEncontrado.talles));
  
          try {
            console.log("Actualizando el stock en la base de datos para el producto:", productoEncontrado.nombre);
  
            formDataToSend.forEach((value, key) => {
              console.log(key + ": " + value);
            });
  
            await axios.put(
             `${ApiUrls.productos}/${productoEncontrado._id}`,
              formDataToSend,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
  
            console.log('Stock actualizado en la base de datos.');
  
            const nuevosProductos = productos.map((prod) =>
              prod.nombre === productoEncontrado.nombre
                ? { ...productoEncontrado, talles: productoEncontrado.talles }
                : prod
            );
            setProductos(nuevosProductos);
  
          } catch (error) {
            console.error('Error al actualizar el stock en la base de datos:', error);
          }
        } else {
          console.log('Stock insuficiente para este producto.');
        }
      } else {
        console.log('Talle no encontrado para este producto.');
      }
    } else {
      console.log('Producto no encontrado en la lista.');
    }
  };
  
  


  const descontarStock = (pedido) => {

  pedido.productos.forEach(prod => {

  descontarStockDeProducto(prod);    
  });  

  }

  const eliminarPedido2 = async () => {
    try {
      console.log("Eliminamos el pedido")
      await eliminarPedido(pedidoId)
      setShowModal(false); 
    } catch (error) {
      console.log(error);
    }
  };


  const seguirPedido = () => {
    console.log("Se sigue con el pedido a pesar de la falta de stock");
    setShowModal(false); 
  };


  const confirmarPedido = async (id) => {
   try {
    console.log("Vamos a verificar los stocks de los productos del pedido " + id)
    const response = await axios.get(`${ApiUrls.pedidos}/${id}`);
    const pedido = response.data;
    console.log("Vamos a verificar el stock del pedido ", pedido)
    let stockpositivo = false;
    stockpositivo = await hayStock(pedido)
    console.log("Hay stock???" , stockpositivo)
    if(!stockpositivo) {
      console.log("Falta stock de al menos un producto")
      setPedidoId(id); 
      setShowModal(true); 
    } else {
     console.log("Hay stock asi que procedemos a confirmar el pedido")
      confirmarPedido2(id,pedido);
    }
   } catch (error) {
    console.log(error)
   }
  }
  
  const confirmarPedido2 = async (id,pedido) => {
    try {

      const response = await fetch(`${ApiUrls.pedidos}/${id}`, {
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
        descontarStock(pedido)
        sumarIngreso(id);

    


    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    }
  };


  const acumularCantidadVenta = async () => {
    try {
  
        const hoy = new Date();
        const fechaHoy = hoy.toISOString().split('T')[0];

        const datosVenta = {
            fecha: fechaHoy, 
            cantVentas: 1,
        };

        console.log("Sumamos una venta");
        const respuesta = await axios.post(`${ApiUrls.pedidos}/estadisticas`, datosVenta);


        console.log('Respuesta de la API:', respuesta.data);
        return respuesta.data;
    } catch (error) {
        console.error('Error al sumar la venta:', error);
        throw error; 
    }
};

const sumarTotalVenta = async (id) => {
  try {
       const respuesta = await axios.get(`${ApiUrls.pedidos}/${id}`);


      if (typeof respuesta.data.total === 'undefined') {
          throw new Error('El campo "total" no está disponible en la respuesta');
      }

      const totalVenta = respuesta.data.total;
      console.log(`Total de la venta para el pedido ${id}:`, totalVenta);
      
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];

      const datosVenta = {
        fecha: fechaHoy, 
        totalVendido: totalVenta,
      };

      console.log("Sumamos una venta");
      const response = await axios.post(`${ApiUrls.estadisticas}`, datosVenta);

      console.log('Respuesta de la API:', response.data);

      return response.data; 

  } catch (error) {
      console.error('Error al sumar el total de la venta:', error);
      throw error; 
  }
};



  const despacharPedido = async (id) => {
    try {
      const response = await fetch(`${ApiUrls.pedidos}/${id}`, {
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
      acumularCantidadVenta();
      sumarTotalVenta(id);

      console.log('Pedido despachado:', id);
    } catch (error) {
      console.error('Error al despachar el pedido:', error);
    }
  };

  const eliminarPedido = async (id) => {
    try {
      const response = await fetch(`${ApiUrls.pedidos}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
      }

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
      <br /> <br /> <br />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Falta de Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>Cantidad insuficiente de al menos un producto</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={eliminarPedido2}>
            Eliminar Pedido
          </Button>
          <Button variant="primary" onClick={seguirPedido}>
            Seguir Pedido
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="max-w-full mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
  <h2 className="text-2xl font-bold mb-4 text-black">Lista de Pedidos</h2>
  <div className="mb-4 flex space-x-2">
    <button
      onClick={() => setTipo('confirmado')}
      className={`px-4 py-2 rounded-lg transition duration-300 border-2 ${
        tipo === 'confirmado' ? 'bg-gold border-black text-black' : 'bg-gray-300 text-black hover:bg-gray-400'
      }`}
    >
      Pedidos Confirmados
    </button>
    <button
      onClick={() => setTipo('pendiente')}
      className={`px-4 py-2 rounded-lg transition duration-300 border-2 ${
        tipo === 'pendiente' ? 'bg-gold border-black text-black' : 'bg-gray-300 text-black hover:bg-gray-400'
      }`}
    >
      Pedidos Pendientes
    </button>
    <button
      onClick={() => setTipo('todos')}
      className={`px-4 py-2 rounded-lg transition duration-300 border-2 ${
        tipo === 'todos' ? 'bg-gold border-black text-black' : 'bg-gray-300 text-black hover:bg-gray-400'
      }`}
    >
      Todos los Pedidos
    </button>
  </div>

  {/* Contenedor para la tabla con desplazamiento horizontal */}
  <div className="overflow-x-auto max-w-full">
    <table className="min-w-full border-4 border-black rounded-lg bg-gray-50 w-full">
      <thead>
        <tr className="bg-black text-gold">
          <th className="border-b border-black px-6 py-3">ID</th>
          <th className="border-b border-black px-6 py-3">Provincia</th>
          <th className="border-b border-black px-6 py-3">Cliente</th>
          <th className="border-b border-black px-6 py-3">Total</th>
          <th className="border-b border-black px-6 py-3">Estado</th>
          <th className="border-b border-black px-6 py-3">Fecha de Creación</th>
          <th className="border-b border-black px-6 py-3">Hora de Creación</th>
          <th className="border-b border-black px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pedidosFiltrados.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center py-4 text-gray-500">
              No hay pedidos disponibles
            </td>
          </tr>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <tr key={pedido._id} className="hover:bg-gray-100 transition duration-200">
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido._id}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido.cliente.provincia}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">${pedido.total}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido.estado}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido.fechaCreacion}</td>
              <td className="border-b border-black px-6 py-3 text-gray-800">{pedido.horaCreacion}</td>
              <td className="border-b border-black px-6 py-3 flex space-x-2">
                {pedido.estado !== 'confirmado' && (
                  <button
                    onClick={() => confirmarPedido(pedido._id)}
                    className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Confirmar
                  </button>
                )}
                <button
                  onClick={() => handlePedidoDetail(pedido._id)}
                  className="px-4 py-2 bg-black text-gold rounded-lg hover:bg-gray-800 transition duration-300"
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
                <button
                  onClick={() => eliminarPedido(pedido._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Eliminar
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
