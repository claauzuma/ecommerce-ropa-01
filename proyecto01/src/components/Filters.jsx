import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import './Filters.css';

const Filters = ({ onChange, filters }) => {
  const handleSearchChange = (event) => {
    onChange({ searchTerm: event.target.value });
  };

  return (
    <section className="filters-container">
      <div className="filters-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          id="searchInput"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar productos"
          className="search-input"
        />
      </div>
    </section>
  );
};

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    searchTerm: PropTypes.string,
  }).isRequired,
};

export default Filters;
