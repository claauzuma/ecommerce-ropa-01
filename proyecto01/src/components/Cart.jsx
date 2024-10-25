import React from 'react';
import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from './Icons';
import { useId } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import Cantidades from './Cantidades';
import { useNavigate } from 'react-router-dom'; 

const Cart = () => {
  const cartCheckboxId = useId();
  const { clearCart, cart, isCartVisible, setIsCartVisible, updateQuantity } = useCart();
  const navigate = useNavigate(); 

  const closeCart = () => setIsCartVisible(false);


  const handleCheckout = () => {
    const totalPrice = cart.reduce((acc, product) => acc + product.price * product.cantidad, 0);
    const purchaseData = {
      products: cart,
      total: totalPrice,
    };
  
    setIsCartVisible(false)
    navigate('/generar-compra', { state: { purchaseData } });
  };

  return (
    <>
      <label htmlFor={cartCheckboxId} className="cursor-pointer">
        <CartIcon className="w-8 h-8 text-blue-600" />
      </label>

      <input id={cartCheckboxId} type="checkbox" hidden />

      <aside
        className={`fixed top-0 right-0 w-80 bg-white shadow-lg p-5 mt-16 rounded-lg transition-transform duration-300 transform ${
          isCartVisible ? 'translate-x-0' : 'translate-x-full'
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
                  <Cantidades
                    stock={product.stock}
                    cant={product.cantidad}
                    onChange={(newCantidad) => updateQuantity(product._id, newCantidad)}
                    productId={product._id}
                  />
                  <small className="text-gray-500 mt-1">Total: ${product.price * product.cantidad}</small>
                  <button className="text-red-500 hover:text-red-700 ml-2">
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
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center"
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
