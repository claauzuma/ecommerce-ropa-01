import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../components/Products.css';
import Header from '../components/Header';
import Products from '../components/Products';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './IndexProd.css';
import ApiUrls from'../components/ApiUrls';
import Imagen from '../assets/logo.png';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import ProductBanner from '../components/ProductBanner';

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
        const response = await axios.get(ApiUrls.productos); // Usamos la URL de productos desde apiUrls.js
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
      const matchesSearchTerm = product.nombre
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
    <ProductBanner/>
    <br /> 
    <br />
    <br />
    <br />


    


<Banner className="-mt-2" />  
      <Categories changeFilters={handleFiltersChange} filters={filters} />
      <Header changeFilters={handleFiltersChange} filters={filters}/>

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
