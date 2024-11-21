import React from 'react';
import { useCart } from '../context/CartContext';
import PropTypes from 'prop-types';

const Cantidades = ({ stock, cant, onChange, productId, color, talle }) => {
  
  const { updateQuantity } = useCart();
  if (!productId || !color || !talle) {
    console.error('Missing required prop:', { productId, color, talle });
    return null;
  }
  else {
    console.log("Se reciben bien los parametros")
  }

  const handleIncrement = () => {
    if (cant < stock) {
      console.log("Esta perfectooo")
      const newCantidad = cant + 1;
      console.log("La nueva cantidad es " + newCantidad)
      updateQuantity({ id: productId, color, talle }, newCantidad);
      onChange(newCantidad);  
    
    }
  };

  const handleDecrement = () => {
    if (cant > 1) {
      const newCantidad = cant - 1;
      updateQuantity({ id: productId, color, talle }, newCantidad);
      onChange(newCantidad);  
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        onClick={handleDecrement}
        disabled={cant <= 1}
      >
        -
      </button>
      <span className="mx-2 text-lg">{cant}</span>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        onClick={handleIncrement}
        disabled={cant >= stock}
      >
        +
      </button>
    </div>
  );
};

Cantidades.propTypes = {
  stock: PropTypes.number.isRequired,
  cant: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  talle: PropTypes.string.isRequired,
};

export default Cantidades;
