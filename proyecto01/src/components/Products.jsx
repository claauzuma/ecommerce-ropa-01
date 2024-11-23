import React from 'react';
import PropTypes from 'prop-types'; 
import { useNavigate } from 'react-router-dom'; 
import './Products.css';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import ApiUrls from './ApiUrls';

const Products = ({ products }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

  

  const handleClick = async (id) => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];

    const datosVisitaDetail = {
      fecha: fechaHoy,
      id: id,
    };

    console.log("Sumamos una visita al PRODUCTOOOOOOOOOOOOOOOOOOOOOOOOO DE ID" + id);
    await axios.post(ApiUrls.estadisticas, datosVisitaDetail);

    navigate(`/product/${id}`);
  };

  return (
    <main className="products">
      <ul>
        {products.map((product) => {
          // Calculamos el precio aumentado en un 10% y el precio original
          let precioOriginal = Math.round(product.beforePrice);
          const precioConDescuento = Math.round(product.price);
          if(precioOriginal == precioConDescuento) {
            precioOriginal = precioConDescuento * 1.15
          }

          let descuento = Math.round((precioOriginal * 100 / precioConDescuento) - 100);

  
          // Establecemos si el producto está en oferta
          const isOffer = product.isOffer; // Esto lo puedes agregar a tu base de datos o definir en el frontend
          const isPromo = product.promo; // Asegúrate de que 'promo' esté en tu base de datos

  
          return (
            <li
              key={product._id}
              className={`product-item rounded-lg shadow-lg overflow-hidden ${isOffer ? 'offer-product' : ''} m-0`}


            >
              {/* Etiqueta de oferta */}
              {isOffer && <div className="offer-tag">¡Oferta!</div>}
  
              {/* Etiqueta de Promo */}
              {isPromo && (
                <div className="promo-tag">
                  <span className="promo-text">¡Promo!</span>
                </div>
              )}
  
              {/* Etiqueta de descuento */}
              {isPromo && (
                <div className="discount-tag">
                  <span className="discount-text">-{descuento}%</span>
                </div>
              )}
  
  
              {/* Imagen del producto */}
              <img
                src={product.images[0]}
                alt={product.descripcion}
                className="product-image w-[90%] h-48 object-cover mx-auto mb-0"
              />
              
              <div className="p-2">
                <h2 className="product-title text-xl font-semibold">{product.nombre}</h2>
              </div>
  
<div className="px-2 py-1 text-center">
  <p className="text-gold font-semibold text-lg">
    <span className="line-through text-gray-500">${precioOriginal}</span>
    <span className="ml-2 text-gold" style={{ fontSize: '1.4rem' }}>${precioConDescuento}</span>
  </p>
</div>

  
              {/* Botón de detalle y logo de WhatsApp */}
              <div className="px-2 py-1 flex justify-between items-center">
                <button
                  onClick={() => handleClick(product._id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg text-base"
                >
                  Detalle
                </button>
  
                {/* Logo de WhatsApp */}
                <a
                  href={`https://wa.me/1234567890?text=Hola, estoy interesado en el producto ${product.nombre}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 1.85.51 3.58 1.39 5.07L2 22l4.96-1.32c1.47.8 3.14 1.26 4.95 1.26 5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18c-1.63 0-3.16-.39-4.52-1.08l-.32-.16L5.5 20l1.09-3.61-.25-.39c-.74-1.17-1.15-2.55-1.15-3.96 0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm3.43-6.04c-.24-.12-1.42-.7-1.63-.78-.21-.09-.37-.12-.52.12s-.6.78-.74.94c-.13.17-.27.19-.51.07-.25-.12-1.05-.39-2.01-1.23-.74-.66-1.23-1.49-1.37-1.74-.14-.25-.01-.39.1-.51.1-.1.25-.26.37-.39.12-.13.17-.22.25-.37.08-.15.04-.28-.02-.4-.07-.12-.6-1.44-.82-1.95-.22-.52-.45-.45-.62-.46-.16-.01-.35-.02-.54-.02s-.4 0-.61.19c-.2.2-.8.78-.8 1.9 0 1.12.82 2.2.94 2.36s1.61 2.56 3.91 3.51c.54.23.96.36 1.29.47.54.17 1.04.15 1.43.09.44-.07 1.42-.58 1.63-1.14.2-.57.2-1.06.14-1.15-.06-.1-.21-.15-.45-.27z" />
                  </svg>
                </a>
              </div>
            </li>
          );
        })}
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
      images: PropTypes.arrayOf(PropTypes.string).isRequired, 
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      isOffer: PropTypes.bool, // Añadimos el atributo isOffer para saber si el producto está en oferta
    })
  ).isRequired,
};

export default Products;
