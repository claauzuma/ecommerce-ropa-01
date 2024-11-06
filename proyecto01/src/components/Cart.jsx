import React from 'react';
import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from './Icons';
import { useId } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import Cantidades from './Cantidades';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const Cart = () => {
  const cartCheckboxId = useId();
  const { clearCart, cart, isCartVisible, setIsCartVisible, updateQuantity, removeFromCart } = useCart();  // Asegúrate de tener una función `removeFromCart`
  const navigate = useNavigate(); 

  const closeCart = () => setIsCartVisible(false);

  const añadirPrepedido = async () => {
    try {
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];

      const datosAñadidos = {
        fecha: fechaHoy, 
        prepedidos: 1,
      };

      console.log("Sumamos un pedido realizado");
      const respuesta = await axios.post('http://localhost:8080/api/estadisticas/', datosAñadidos);

      console.log('Respuesta de la API:', respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error('Error al añadir cantidad pre pedido:', error);
      throw error; 
    }
  };

  const handleCheckout = async () => {
    const totalPrice = cart.reduce((acc, product) => acc + product.price * product.cantidad, 0);
    const purchaseData = {
      products: cart,
      total: totalPrice,
    };

    try {
      await añadirPrepedido(); // Manejamos la respuesta de la API correctamente
      setIsCartVisible(false);
      navigate('/generar-compra', { state: { purchaseData } });
    } catch (error) {
      console.error("Error al procesar el prepedido");
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  return (
    <>
      <label htmlFor={cartCheckboxId} className="cursor-pointer">
        <CartIcon className="w-8 h-8 text-yellow-500" />
      </label>

      <input id={cartCheckboxId} type="checkbox" hidden />

      <aside
        className={`fixed top-0 right-0 w-140 bg-gray-800 text-white shadow-lg p-5 mt-16 rounded-lg transition-transform duration-300 transform ${
          isCartVisible ? 'translate-x-0' : 'translate-x-full'
        } border-4 border-solid border-yellow-500`}  
      >
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Carrito de Compras</h2>

        <button onClick={closeCart} className="text-gray-400 hover:text-gray-200">
          Cerrar
        </button>

        <ul className="max-h-60 overflow-y-auto">
          {cart.length === 0 ? (
            <li className="text-center py-4">El carrito está vacío</li>
          ) : (
            cart.map((product) => (
              <li key={product._id} className="flex items-center justify-between border-b border-gray-600 py-2">
                <img
                  className="w-20 h-20 object-cover rounded"
                  src={product.images[0]}
                  alt={product.descripcion}
                />
                <div className="ml-6 flex-grow">
                  <strong className="text-lg text-yellow-500">{product.nombre}</strong>
                  <p className="text-gray-400">Precio: ${product.price}</p>
                  <p className="text-gray-400">Talle: {product.selectedTalle.talle}</p>
                  <p className="text-gray-400 flex items-center">
                    Color: 
                    <div
                      className="w-6 h-6 rounded-full ml-2"
                      style={{ backgroundColor: product.selectedColor.color }}
                    ></div>
                  </p>
                  <p className="text-gray-400">Stock: {product.selectedColor.stock}</p>
                </div>
                <footer className="flex flex-col items-end">
                  <Cantidades
                    stock={product.selectedColor.stock}  // Asegúrate de que 'stock' sea el stock del color seleccionado.
                    cant={product.cantidad}             // La cantidad del producto en el carrito.
                    onChange={(newCantidad) => updateQuantity(product._id, newCantidad)}  // Actualiza la cantidad en el carrito.
                    productId={product._id}             // El ID del producto para asegurarte de que estás actualizando el correcto.
                  />
                  <small className="text-gray-400 mt-1">Total: ${product.price * product.cantidad}</small>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    <RemoveFromCartIcon />
                  </button>
                </footer>
              </li>
            ))
          )}
        </ul>

        {/* Botón de Iniciar Compra */}
        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-yellow-500 text-gray-800 py-2 rounded hover:bg-yellow-600 flex items-center justify-center"
        >
          Iniciar Compra
        </button>

        {/* Botón para limpiar el carrito */}
        <button
          onClick={clearCart}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center"
        >
          <ClearCartIcon className="mr-2" />
          Limpiar Carrito
        </button>
      </aside>
    </>
  );
};

export default Cart;
