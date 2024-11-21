import React from 'react';
import PropTypes from 'prop-types';
import './Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApiUrls from './ApiUrls';

const ProductsAdmin = ({ products, setProducts }) => {
  const navigate = useNavigate();

  const handleModify = (id) => {
    console.log("Vamos a editar el producto " + id);
    navigate(`/admin/form-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar el producto?`);
    console.log(`Eliminar producto con ID: ${id}`);
    if (confirmDelete) {
      console.log("Eliminamos el producto");
      try {
        const response = await axios.delete(`${ApiUrls.productos}/${id}`);
        console.log("Producto eliminado correctamente:", response.data);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
      } catch (error) {
        console.log("Error eliminando el producto", error);
      }
    } else {
      console.log("Eliminación cancelada");
    }
  };

  return (
    <main className="products">
      <ul>
        {products.map((product) => {
          // Calculamos el precio aumentado en un 10% y el precio original
          let precioOriginal = Math.round(product.beforePrice || product.price * 1.15);
          const precioConDescuento = Math.round(product.price);

          let descuento = Math.round((precioOriginal * 100 / precioConDescuento) - 100);

          const isOffer = product.isOffer;
          const isPromo = product.promo;

          return (
            <li
              key={product._id}
              className={`product-item border rounded-lg shadow-lg overflow-hidden border-gold ${isOffer ? 'offer-product' : ''}`}
            >
              {/* Etiqueta de oferta */}
              {isOffer && <div className="offer-tag">¡Oferta!</div>}

              {/* Etiqueta de promoción */}
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

              {/* Precio con descuento */}
              <div className="px-2 py-1 text-center">
                <p className="text-gold font-semibold text-lg">
                  <span className="line-through text-gray-500">${precioOriginal}</span>
                  <span className="ml-2 text-gold">${precioConDescuento}</span>
                </p>
              </div>

              {/* Botones de modificar y eliminar */}
              <div className="px-2 py-2 flex flex-col items-center">
  {/* Botón Detalle */}
  <button
    onClick={() => navigate(`/admin/product-detail/${product._id}`)}
    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-base mb-2"
  >
    Detalle
  </button>

  {/* Contenedor para Modificar y Eliminar */}
  <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:gap-2">
    <button
      onClick={() => handleModify(product._id)}
      className="w-full sm:w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg text-base mb-2 sm:mb-0"
    >
      Modificar
    </button>

    <button
      onClick={() => handleDelete(product._id)}
      className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-base"
    >
      Eliminar
    </button>
  </div>
</div>


            </li>
          );
        })}
      </ul>
    </main>
  );
};

ProductsAdmin.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      isOffer: PropTypes.bool,
      promo: PropTypes.bool,
      beforePrice: PropTypes.number,
    })
  ).isRequired,
  setProducts: PropTypes.func.isRequired,
};

export default ProductsAdmin;
