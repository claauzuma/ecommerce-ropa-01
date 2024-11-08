import React from 'react';
import PropTypes from 'prop-types'; 
import './Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductsAdmin = ({ products, setProducts }) => {
  const navigate = useNavigate();

  const handleModify = (id) => {
    console.log("Vamos a editar al producto " + id);
    navigate(`/admin/form-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar al producto?`);
    console.log(`Eliminar producto con ID: ${id}`);
    if (confirmDelete) {
      console.log("Eliminamos al producto");
      try {
        const response = await axios.delete(`http://localhost:8080/api/productos/${id}`);
        console.log("Producto eliminado correctamente:", response.data);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
      } catch (error) {
        console.log("Error eliminando al producto", error);
      }
    } else {
      console.log("Eliminación cancelada");
    }
  };

  return (
    <main className='products'>
      <ul className="flex flex-wrap justify-between"> {/* Cambiado a flex para el diseño */}
        {products.map((product) => (
          <li key={product._id} className='product-item border rounded-lg shadow-lg overflow-hidden border-gold'>
            <img 
              src={product.images[0]}
              alt={product.descripcion}
              className='product-image' 
            />
            <div className="p-4">
              <h2 className="product-title font-bold text-xl">{product.descripcion}</h2>
              <p className="text-gold font-semibold">Categoría: {product.categoria}</p>
              <p className="text-gold font-semibold">Precio: ${product.price}</p>
              <p className="text-gold font-semibold">Stock: {product.stock}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between p-4 border-t space-y-2 sm:space-y-0 sm:space-x-2">
              <button 
                onClick={() => handleModify(product._id)} 
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Modificar
              </button>
              <button 
                onClick={() => handleDelete(product._id)} 
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

// Validación de props usando PropTypes
ProductsAdmin.propTypes = {
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
  setProducts: PropTypes.func.isRequired,
};

export default ProductsAdmin;
