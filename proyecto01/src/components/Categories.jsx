import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes
import axios from 'axios';
import ApiUrls from './ApiUrls';  // Asegúrate de que ApiUrls.productos sea la URL correcta
import './Categories.css';

const Categories = ({ changeFilters, filters }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(ApiUrls.productos); // Asegúrate de que ApiUrls.productos sea la URL correcta
        // Obtener categorías únicas y añadir "Todas" al principio
        const uniqueCategories = ['Todas', ...new Set(response.data.map((product) => product.categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Si se selecciona "Todas", se restablece el filtro de categoría a "all"
    changeFilters({ category: category === 'Todas' ? 'all' : category });
  };

  return (
    <div className="categories-container">
      <div className="categories-scroll">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-button ${filters.category === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)} // Actualiza el filtro cuando se hace clic
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// Validación de las props
Categories.propTypes = {
  changeFilters: PropTypes.func.isRequired, // La función para cambiar los filtros debe ser obligatoria
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired, // El filtro de categoría debe ser una cadena de texto
  }).isRequired, // El objeto filters debe ser obligatorio
};

export default Categories;
