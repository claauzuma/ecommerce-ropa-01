import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Filters.css';

const Filters = ({ onChange, filters }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/productos');
        const uniqueCategories = [...new Set(response.data.map((product) => product.categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (event) => {
    onChange({ searchTerm: event.target.value });
  };

  const handleCategoryChange = (event) => {
    onChange({ category: event.target.value });
  };

  if (!filters) return null; // Maneja el caso en que filters es undefined

  return (
    <section className="flex flex-col md:flex-row justify-between items-center p-4 bg-black text-white rounded-lg shadow-md mx-auto max-w-3xl">
      {/* Campo de búsqueda */}
      <div className="flex flex-col mb-4 md:mb-0 md:w-2/3">
        <label htmlFor="searchInput" className="block text-lg font-semibold mb-1">
          Buscar producto
        </label>
        <input
          type="text"
          id="searchInput"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Busca productos..."
          className="w-full p-2 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue text-black"
        />
      </div>

      {/* Filtro de categoría */}
      <div className="flex flex-col md:w-1/3 md:flex-row md:items-center ml-2">
        <label htmlFor="categoryFilter" className="block text-lg font-semibold mb-1 md:mb-0 md:mr-2">
          Categoría
        </label>
        <select
          id="categoryFilter"
          value={filters.category}
          onChange={handleCategoryChange}
          className="p-2 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue text-black"
        >
          <option value="all">Todas</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

// PropTypes
Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    searchTerm: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
};

export default Filters;
