import React from 'react';
import PropTypes from 'prop-types'; 
import './Products.css';
import { AddToCartIcon } from './Icons';
import { useCart } from '../context/CartContext'; // Asegúrate de que la ruta sea correcta

const Products = ({ products }) => {
  const { addToCart } = useCart(); // Usa el hook para acceder a addToCart

  return (
    <main className='products'>
      <ul>
        {products.map((product) => (
          <li key={product._id} className='product-item border rounded-lg shadow-lg overflow-hidden border-gold'>
            <img 
              src={product.image} 
              alt={product.descripcion}
              className='product-image w-full h-48 object-cover' 
            />
            <div className="p-4">
              <h2 className="font-bold text-xl">{product.descripcion}</h2>
              <p className="text-gold font-semibold">Categoría: {product.categoria}</p>
              <p className="text-gold font-semibold">Precio: ${product.price}</p>
              <p className="text-gold font-semibold">Stock: {product.stock}</p>
            </div>
           
            <div className="p-4">
              <button 
                className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => addToCart(product)} // Llama a addToCart con el producto
              >
                <AddToCartIcon />
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
      _id: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Products;
