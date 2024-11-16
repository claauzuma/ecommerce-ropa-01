import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../components/Products.css';
import Header from '../components/Header';
import Products from '../components/Products';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './indexProd.css';

const IndexProd = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    searchTerm: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/productos');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función de filtrado de productos
  const filterProducts = (products) => {
    return products.filter((product) => {
      const matchesCategory =
        filters.category === 'all' || product.categoria === filters.category;
      const matchesSearchTerm = product.descripcion
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      return matchesCategory && matchesSearchTerm;
    });
  };

  const filteredProducts = filterProducts(products);

  // Manejador de cambios de filtros
  const handleFiltersChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <>
      {/* Buscador y Filtros */}
      <div className="container mx-auto p-6 mt-4">
        <Header changeFilters={handleFiltersChange} filters={filters} />
      </div>

      {/* Lista de Productos */}
      <div className="container mx-auto p-6">
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <Products products={filteredProducts} setProducts={setProducts} />
        )}
      </div>
    </>
  );
};

// PropTypes
IndexProd.propTypes = {
  products: PropTypes.array,
};

export default IndexProd;
