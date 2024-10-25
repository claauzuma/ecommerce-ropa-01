import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const GenerarCompra = () => {
  const { state } = useLocation(); // Obtener datos del estado
  const { products, total } = state?.purchaseData || { products: [], total: 0 }; // Desestructurar datos

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    direccion: '',
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir el mensaje que quieres enviar
    const message = `Detalles de la compra:\n\n` +
                    `Nombre: ${formData.nombre}\n` +
                    `Apellido: ${formData.apellido}\n` +
                    `Celular: ${formData.celular}\n` +
                    `Email: ${formData.email}\n` +
                    `Dirección: ${formData.direccion}\n\n` +
                    `Productos:\n` +
                    products.map(product => `${product.descripcion} - $${product.price} x ${product.cantidad}`).join('\n') + 
                    `\nTotal: $${total}`;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Tu número de WhatsApp (incluye el código de país, pero sin el signo + ni espacios)
    const phoneNumber = '5491158641032'; // Tu número actualizado
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Abrir WhatsApp Web en una nueva pestaña
    window.open(whatsappLink, '_blank');
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
