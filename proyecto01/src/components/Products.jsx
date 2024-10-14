import React from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import './Products.css'
import { AddToCartIcon } from './Icons';

const Products = ({ products }) => {
  return (
    <main className='products'>

      <ul>
        {products.map(product => (
          <li key={product.id} className='product-item'>
            <img src={product.thumbnail} alt={product.title} className='product-image' />
             <div>
                <strong> {product.title}</strong> -&{product.price}
             </div>
            <div>
                <button>
                 <AddToCartIcon/>
                </button>
            </div>
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
