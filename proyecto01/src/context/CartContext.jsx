import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Crea el contexto
export const CartContext = createContext();

// Proveedor del contexto
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const agregarVisitaCarrito = async () => {
    try {
  
        const hoy = new Date();
        const fechaHoy = hoy.toISOString().split('T')[0];

        const datosAñadido = {
            fecha: fechaHoy, 
            anadidosAlCarrito: 1,
        };

        console.log("Sumamos una visita al carrito");
        const respuesta = await axios.post('http://localhost:8080/api/estadisticas/', datosAñadido);

        console.log('Respuesta de la API:', respuesta.data);
        return respuesta.data;
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        throw error; 
    }
};

  const addToCart = (product) => {
    agregarVisitaCarrito();
    const productInCartIndex = cart.findIndex(item => item.descripcion === product.descripcion);

    if (productInCartIndex >= 0) {

      const newCart = structuredClone(cart);
      newCart[productInCartIndex].cantidad += 1;
      setCart(newCart);
    } else {

      setCart(prevState => ([
        ...prevState,
        {
          ...product,
          cantidad: 1,
        },
      ]));
    }
    setIsCartVisible(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    const productInCartIndex = cart.findIndex(item => item._id === productId);

    if (productInCartIndex >= 0) {
      const newCart = structuredClone(cart);
      if (newQuantity > 0) {
        newCart[productInCartIndex].cantidad = newQuantity;
      } else {
        // Si la nueva cantidad es 0, eliminamos el producto del carrito
        newCart.splice(productInCartIndex, 1);
      }
      setCart(newCart);
    }
  };

  const clearCart = () => {
    console.log("Limpiamos el carrito")
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, isCartVisible, setIsCartVisible }}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  return useContext(CartContext);
};
