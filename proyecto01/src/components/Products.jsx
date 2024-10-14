import React from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import { AddToCartIcon } from './Icons';

const Products = ({ products }) => {
  return (
    <main className='products'>

      <ul>
        {products.map(product => (
          <li key={product.id} className='product-item'>
            <img src={product.image} alt={product.name} className='product-image' />
            <h2>{product.name}</h2>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock > 0 ? product.stock : 'Agotado'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

// Validación de props usando PropTypes
Products.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Products;
