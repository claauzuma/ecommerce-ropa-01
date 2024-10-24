import React from 'react';
import PropTypes from 'prop-types'; 
import './Products.css';
import { AddToCartIcon } from './Icons';
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';



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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {products.map((product) => (
            <li key={product._id} className='product-item border rounded-lg shadow-lg overflow-hidden border-gold'>
              <img 
                src={product.image} // Cambiado a product.image para la URL de Cloudinary
                alt={product.descripcion}
                className='product-image w-full h-48 object-cover' 
              />
              <div className="p-4">
                <h2 className="font-bold text-xl">{product.descripcion}</h2>
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
      _id: PropTypes.string.isRequired, // Cambié a string ya que generalmente las IDs son cadenas en APIs
      descripcion: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired, // Asegúrate de agregar la validación para la categoría
      image: PropTypes.string.isRequired, // Asegúrate de que la imagen sea una URL válida
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ).isRequired,
};

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
  setProducts: PropTypes.func.isRequired, // Agregar validación para setProducts
};

export default ProductsAdmin;
