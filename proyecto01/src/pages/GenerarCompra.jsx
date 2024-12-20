import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import ApiUrls from '../components/ApiUrls';

const GenerarCompra = () => {
  const { state } = useLocation();
  const { products, total } = state?.purchaseData || { products: [], total: 0 };
  const { clearCart } = useCart();

  const navigate = useNavigate();

  const añadirPedido = async () => {
    try {
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];

      const datosAñadidos = {
        fecha: fechaHoy, 
        pedidosRealizados: 1,
      };

      console.log("SUMAMOS UN PEEEEEEEDIDO PARA PENDIENTEEEEEEEEEEEES");
      const respuesta = await axios.post(ApiUrls.estadisticas, datosAñadidos);

      console.log('Respuesta de la API:', respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error('Error al añadir cantidad pre pedido:', error);
      throw error; 
    }
  };

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    direccion: '',
    provincia: '', 
    celular: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para controlar el modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mandarWhatsapp = () => {
    const numeroWhatsApp = '1158641032';
    const mensaje = encodeURIComponent(`Hola Blessed Store! Quiero hacer un pedido, este es el detalle:

Orden Nº PED-00002586
${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}

${products.map(p => `✅ ${p.cantidad} x ${p.descripcion} | $${p.price * p.cantidad}`).join('\n')}

Forma de Entrega
• Método de Entrega: Envío a Domicilio
• Recibe: ${formData.nombre} ${formData.apellido}
• Dirección: ${formData.direccion}
• Provincia: ${formData.provincia}  
• Google Maps: https://www.google.com/maps/place/-34.6737824,-58.4705525
• Hora de Envío: Lo Antes Posible
• Entre calles para mejor ubicación: ${formData.direccion}

Forma de Pago
• Método de Pago: Efectivo
• Abona con: $${total}

* Subtotal del Pedido: $${total}
* Total del Pedido: $${total}`);

    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`, '_blank');
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    setIsModalOpen(true);  // Abrir el modal cuando se hace submit
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    const now = new Date();
    const fechaCreacion = now.toISOString().split('T')[0];
    const horaCreacion = now.toTimeString().split(' ')[0];

    const dataToSend = {
      cliente: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        direccion: formData.direccion,
        provincia: formData.provincia, 
      },
      productos: products.map((product) => ({
        id: product._id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        cantidad: product.cantidad,
        talle: product.selectedTalle.talle,
        color: product.selectedColor.color
      })),
      total: total,
      estado: 'pendiente',
      fechaCreacion: fechaCreacion, 
      horaCreacion: horaCreacion, 
    };

    try {
      const response = await fetch(ApiUrls.pedidos, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Pedido enviado con éxito:', responseData);
        alert("Pedido realizado con éxito");
        añadirPedido();
        mandarWhatsapp();
        clearCart();

        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Error al enviar el pedido:', errorData);
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);  // Cerrar el modal si el usuario cancela
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg border-4 border-black mt-10"> 
      <h2 className="text-2xl font-bold text-gold mb-6 text-center">Detalles de la Compra</h2>
      {products.length === 0 ? (
        <p className="text-center text-red-500">No hay productos en la compra</p>
      ) : (
        <>
          <ul className="mb-6 border-b border-gray-600 pb-4">
            {products.map((product) => (
              <li key={product._id} className="flex justify-between py-2 text-white">
                <span>{product.descripcion}</span>
                <span>${product.price} x {product.cantidad}</span>
              </li>
            ))}
            <li className="font-bold text-right text-white">Total: ${total}</li>
          </ul>
          <form onSubmit={handleSubmit1}>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="nombre">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="apellido">Apellido</label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="dni">DNI</label>
              <input
                type="text"
                name="dni"
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="celular">Celular</label>
              <input
                type="tel"
                name="celular"
                id="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="provincia">Provincia</label>
              <input
                type="text"
                name="provincia"
                id="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-white mb-1" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                name="direccion"
                id="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white border-2 border-black rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Confirmar Pedido
            </button>
          </form>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-black p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Resumen del Pedido</h2>
      <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p>
      <p><strong>DNI:</strong> {formData.dni}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Dirección:</strong> {formData.direccion}</p>
      <p><strong>Provincia:</strong> {formData.provincia}</p>
      <p><strong>Total:</strong> ${total}</p>

      {/* Espaciado entre los atributos y los botones */}
      <div className="mb-6"></div>

      <div className="flex space-x-4">
        <button
          onClick={handleSubmit2}
          className="py-2 px-4 bg-blue-600 text-black rounded hover:bg-blue-700"
        >
          Aceptar
        </button>
        <button
          onClick={handleCancel}
          className="py-2 px-4 bg-gold text-black rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default GenerarCompra;
