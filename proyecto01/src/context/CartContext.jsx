import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";


export const CartContext = createContext();


export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const agregarVisitaCarrito = async () => {
    try {
      const hoy = new Date();
      const fechaHoy = hoy.toISOString().split('T')[0];

      const datosAñadido = {
        fecha: fechaHoy,
        anadidosAlCarrito: 1,
      };

      console.log("Sumamos una visita al carrito");
      await axios.post('http://localhost:8080/api/estadisticas/', datosAñadido);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  };

  const addToCart = (product) => {
 
    agregarVisitaCarrito();


    const productInCartIndex = cart.findIndex(
      item => item.descripcion === product.descripcion &&
              item.selectedTalle.talle === product.selectedTalle.talle &&
              item.selectedColor.color === product.selectedColor.color
    );

    if (productInCartIndex >= 0) {
  
      const newCart = structuredClone(cart);
      newCart[productInCartIndex].cantidad += 1;
      setCart(newCart);
    } else {
    
      setCart(prevState => [
        ...prevState,
        {
          ...product,
          cantidad: 1,
        },
      ]);
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

        newCart.splice(productInCartIndex, 1);
      }
      setCart(newCart);
    }
  };

  const removeFromCart = (productId) => {

    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
  };

  const clearCart = () => {
    console.log("Limpiamos el carrito");
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, isCartVisible, setIsCartVisible, user,setUser,token,setToken }}>
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
