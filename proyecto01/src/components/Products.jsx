import React from 'react';
import PropTypes from 'prop-types'; 
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación
import './Products.css';
import { useCart } from '../context/CartContext'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

const Products = ({ products }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleClick = async (id) => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];

    const datosVisitaDetail = {
      fecha: fechaHoy,
      id: id,
    };

    console.log("Sumamos una visita al PRODUCTOOOOOOOOOOOOOOOOOOOOOOOOO DE ID" + id);
    await axios.post('http://localhost:8080/api/estadisticas/', datosVisitaDetail);


    navigate(`/product/${id}`);
  };

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
              <h2 className="product-title">{product.descripcion}</h2>
              <p className="text-gold font-semibold">Precio: ${product.price}</p>
            </div>

            <div className="p-2">
              <button 
                onClick={() => handleClick(product._id)} // Llama a handleClick al hacer clic
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-lg"
              >
                Detalle
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

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
