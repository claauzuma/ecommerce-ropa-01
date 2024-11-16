import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Filters from './Filters';

const Header = ({ changeFilters, filters }) => {
  return (
    <header>
      <Filters onChange={changeFilters} filters={filters} />
    </header>
  );
};

// PropTypes validation for the Header component
Header.propTypes = {
  changeFilters: PropTypes.func.isRequired, // changeFilters should be a function
  filters: PropTypes.shape({
    searchTerm: PropTypes.string, // searchTerm should be a string
    category: PropTypes.string,  // category should be a string
  }).isRequired, // filters should be an object with the specified properties
};

export default Header;
