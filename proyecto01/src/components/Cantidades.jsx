import React from 'react';
import { useCart } from '../context/CartContext';
import PropTypes from 'prop-types';

const Cantidades = ({ stock, cant, productId }) => {
  const { updateQuantity } = useCart();

  const handleIncrement = () => {
    if (cant < stock) {
      updateQuantity(productId, cant + 1);
    }
  };

  const handleDecrement = () => {
    if (cant > 1) {
      updateQuantity(productId, cant - 1);
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
  onChange: PropTypes.func.isRequired, // Asegúrate de que onChange es requerido
  productId: PropTypes.func.isRequired, // Asegúrate de que onChange es requerido
};

export default Cantidades;
