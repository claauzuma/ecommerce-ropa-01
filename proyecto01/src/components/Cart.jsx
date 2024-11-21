import React from 'react';
import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from './Icons';
import { useId } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import Cantidades from './Cantidades';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import ApiUrls from './ApiUrls';
import logo from '../assets/logo.png'

const Cart = () => {
  const cartCheckboxId = useId();
  const { clearCart, cart, isCartVisible, setIsCartVisible, updateQuantity, removeFromCart } = useCart(); 
  const navigate = useNavigate(); 

  const closeCart = () => setIsCartVisible(false);

  const colorTranslations = {
    "rojo": "red",
    "azul": "blue",
    "verde": "green",
    "amarillo": "yellow",
    "negro": "black",
    "blanco": "white",
  };

  const añadirPrepedido = async () => {
    try {
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];

      const datosAñadidos = {
        fecha: fechaHoy, 
        prepedidos: 1,
      };

      console.log("Sumamos un pedido realizado");
      const respuesta = await axios.post(ApiUrls.estadisticas, datosAñadidos);

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
      await añadirPrepedido();
      setIsCartVisible(false);
      console.log("La data del carrito es " + JSON.stringify(purchaseData.products, null, 2));

      navigate('/generar-compra', { state: { purchaseData } });
    } catch (error) {
      console.error("Error al procesar el prepedido");
    }
  };

  const handleRemoveFromCart = (productId, color, talle) => {
    removeFromCart(productId, color, talle);
  };

  return (
    <>
      <label htmlFor={cartCheckboxId} className="cursor-pointer">
        <CartIcon className="w-8 h-8 text-yellow-500" />
      </label>

      <input id={cartCheckboxId} type="checkbox" hidden /> 

      <aside
  className={`fixed top-0 right-0 w-140 bg-black text-white shadow-lg p-5 mt-16 rounded-lg transition-transform duration-300 transform ${
    isCartVisible ? 'translate-x-0' : 'translate-x-full'
  } border-4 border-solid border-yellow-500`}  
>
  {/* Header con el logo y el texto */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-yellow-400">Carrito de Compras</h2>
    <img src={logo} alt="Logo"className="w-24 h-24 ml-2"  />
  </div>

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
                style={{ backgroundColor: colorTranslations[product.selectedColor.color] }}
              ></div>
            </p>
            <p className="text-gray-400">Stock: {product.selectedColor.stock}</p>
          </div>
          <footer className="flex flex-col items-end">
            <Cantidades
              stock={product.selectedColor.stock}  
              cant={product.cantidad}           
              onChange={(newCantidad) => updateQuantity({ id: product._id, color: product.selectedColor.color, talle: product.selectedTalle.talle }, newCantidad)}  
              productId= {product._id}
              color= {product.selectedColor.color}
              
              talle= {product.selectedTalle.talle}
            />
            <small className="text-gray-400 mt-1">Total: ${product.price * product.cantidad}</small>
            <button
              className="text-red-500 hover:text-red-700 ml-2"
              onClick={() => handleRemoveFromCart(product._id, product.selectedColor.color, product.selectedTalle.talle)}
            >
              <RemoveFromCartIcon />
            </button>
          </footer>
        </li>
      ))
    )}
  </ul>

  <button
    onClick={handleCheckout}
    className="mt-4 w-full bg-yellow-500 text-gray-800 py-2 rounded hover:bg-yellow-600 flex items-center justify-center"
  >
    Iniciar Compra
  </button>

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
