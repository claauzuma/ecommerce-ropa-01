import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const GenerarCompra = () => {
  const { state } = useLocation(); // Obtener datos del estado
  const { products, total } = state?.purchaseData || { products: [], total: 0 }; // Desestructurar datos
  const {clearCart} = useCart();

  // Navegación
  const navigate = useNavigate();

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    direccion: '',
    celular: '', // Asegúrate de tener este campo
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const esperarYEjecutar = (callback, delay) => {
    setTimeout(callback, delay);
  };

  const mandarWhatsapp = () => {
    const numeroWhatsApp = '1162344665';
    const mensaje = encodeURIComponent(`Hola! He realizado un pedido con los siguientes detalles:\nNombre: ${formData.nombre} ${formData.apellido}\nDNI: ${formData.dni}\nEmail: ${formData.email}\nDirección: ${formData.direccion}\nCelular: ${formData.celular}\nTotal: $${total}\nProductos: ${products.map(p => `${p.descripcion} (x${p.cantidad})`).join(', ')}`);
    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`, '_blank');
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construir el objeto que quieres enviar
    const dataToSend = {
      cliente: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        direccion: formData.direccion,
      },
      productos: products.map((product) => ({
        id: product._id,
        descripcion: product.descripcion,
        cantidad: product.cantidad,
      })),
      total: total,
      estado: 'pendiente',
    };

    try {
      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Pedido enviado con éxito:', responseData);
        alert("Compra realizada con éxito")
         mandarWhatsapp();
         clearCart();
    
 

        // Redirigir al usuario a la página de inicio
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Error al enviar el pedido:', errorData);
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Detalles de la Compra</h2>
      {products.length === 0 ? (
        <p className="text-center text-red-500">No hay productos en la compra</p>
      ) : (
        <>
          <ul className="mb-4 border border-gray-300 rounded p-2">
            {products.map((product) => (
              <li key={product._id} className="flex justify-between border-b py-2">
                <span>{product.descripcion}</span>
                <span>${product.price} x {product.cantidad}</span>
              </li>
            ))}
            <li className="font-bold text-right">Total: ${total}</li>
          </ul>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="nombre">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="apellido">Apellido</label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="dni">DNI</label>
              <input
                type="text"
                name="dni"
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="celular">Celular</label>
              <input
                type="tel"
                name="celular"
                id="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                name="direccion"
                id="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Siguiente
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default GenerarCompra;