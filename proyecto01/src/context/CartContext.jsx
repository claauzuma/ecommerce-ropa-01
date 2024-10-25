import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Crea el contexto
export const CartContext = createContext();

// Proveedor del contexto
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product) => {
    const productInCartIndex = cart.findIndex(item => item.descripcion === product.descripcion);

    if (productInCartIndex >= 0) {
      // Producto ya está en el carrito, solo incrementamos la cantidad
      const newCart = structuredClone(cart);
      newCart[productInCartIndex].cantidad += 1;
      setCart(newCart);
    } else {
      // Producto no está en el carrito, lo agregamos con cantidad 1
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
