import React from 'react';
import { useCart } from '../context/CartContext';
import PropTypes from 'prop-types';

const Cantidades = ({ stock, cant, onChange, productId }) => {
  const { updateQuantity } = useCart();

  const handleIncrement = () => {
    if (cant < stock) {
      const newCantidad = cant + 1;
      updateQuantity(productId, newCantidad);
      onChange(newCantidad);  
    }
  };

  const handleDecrement = () => {
    if (cant > 1) {
      const newCantidad = cant - 1;
      updateQuantity(productId, newCantidad);
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
};

export default Cantidades;
