import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import '../components/Products.css';
import Header from '../components/Header';
import Products from '../components/Products';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IndexProd = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
  });
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();
  const [visitRecorded, setVisitRecorded] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true); // Cambia el estado de carga antes de iniciar la carga de productos
        try {
            const response = await axios.get('http://localhost:8080/api/productos'); // Cambia esta URL a tu API
            setProducts(response.data); // Establece los productos obtenidos en el estado
        } catch (error) {
            console.error('Error fetching products:', error); // Manejo de errores
        } finally {
            setLoading(false); // Cambia el estado de carga
        }
    };
    const sumarVisitaWeb = async () => {
      try {
    
          const hoy = new Date();
          const fechaHoy = hoy.toISOString().split('T')[0];
  
          const datosVisita = {
              fecha: fechaHoy, 
              visitas: 1,
          };
  
          console.log("Sumamos una visita");
          const respuesta = await axios.post('http://localhost:8080/api/estadisticas/', datosVisita);
  
          console.log('Respuesta de la API:', respuesta.data);
          return respuesta.data;
      } catch (error) {
          console.error('Error al sumar la visita:', error);
          throw error; 
      }
  };
  
  
    const initialize = async () => {
        await sumarVisitaWeb(); 
        await fetchProducts(); 
    };

    initialize(); 

}, [visitRecorded]);


  const filterProducts = (products) => {
    return products.filter((product) => {
      return (
        product.price >= filters.minPrice &&
        (filters.category === 'all' || product.categoria === filters.category) &&
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredProducts = filterProducts(products);

  const handleAddProduct = () => {
    navigate('/admin/form-product'); 
    setSearchTerm(''); // Limpia el término de búsqueda al navegar
  };

  return (
    <>
      {/* Contenedor del buscador y botón */}
      <div className="container mx-auto p-6 mt-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
          />
          <button onClick={handleAddProduct} className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
            Agregar producto
          </button>
        </div>
      </div>

      <Header changeFilters={setFilters} />

      <div className="container mx-auto p-6">
        {loading ? (
          <p>Cargando productos...</p> // Mensaje de carga
        ) : (
          <Products products={filteredProducts} setProducts={setProducts}/>
        )}
      </div>
    </>
  );
};

// Validación de props usando PropTypes
IndexProd.propTypes = {
  // Aquí podrías definir las props si decides pasar alguna al componente
};

export default IndexProd;
