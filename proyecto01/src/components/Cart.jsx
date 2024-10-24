import React from 'react';
import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from './Icons';
import { useId } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const cartCheckboxId = useId();
  const { clearCart, cart, isCartVisible, setIsCartVisible } = useCart(); // Usa el hook para acceder al carrito

  const closeCart = () => setIsCartVisible(false); // Función para cerrar el carrito

  return (
    <>
      <label htmlFor={cartCheckboxId} className="cursor-pointer">
        <CartIcon className="w-8 h-8 text-blue-600" />
      </label>

      <input id={cartCheckboxId} type="checkbox" hidden />

      <aside
        className={`fixed top-0 right-0 w-80 bg-white shadow-lg p-5 mt-16 rounded-lg transition-transform duration-300 transform ${
          isCartVisible ? 'translate-x-0' : 'translate-x-full' // Mostrar u ocultar el carrito
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>

        <button onClick={closeCart} className="text-red-500 hover:text-red-700">
          Cerrar
        </button>

        <ul className="max-h-60 overflow-y-auto">
          {cart.length === 0 ? (
            <li className="text-center py-4">El carrito está vacío</li>
          ) : (
            cart.map((product) => (
              <li key={product._id} className="flex items-center justify-between border-b py-2">
                <img
                  className="w-16 h-16 object-cover rounded"
                  src={product.image}
                  alt={product.descripcion}
                />
                <div className="ml-4 flex-grow">
                  <strong className="text-lg">{product.descripcion}</strong>
                  <p className="text-gray-600">Precio: ${product.price}</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                </div>
                <footer className="flex flex-col items-end">
                  <small className="text-gray-500">Cantidad: {product.cantidad}</small>
                  <small className="text-gray-500">Total: ${product.price * product.cantidad}</small>
                  <div className="flex items-center mt-1">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      +
                    </button>
                    <button className="text-red-500 hover:text-red-700 ml-2">
                      <RemoveFromCartIcon />
                    </button>
                  </div>
                </footer>
              </li>
            ))
          )}
        </ul>

        <button 
          onClick={clearCart} 
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center"
        >
          <ClearCartIcon className="mr-2" />
          Limpiar Carrito
        </button>
      </aside>
    </>
  );
};

export default Cart;
