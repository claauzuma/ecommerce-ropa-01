import React, { useState } from 'react';  // Importa React y useState en la misma línea
import { AddToCartIcon } from './components/Icons'; 
import Products from './components/Products';
import initialProducts from './mocks/Products.json'; // Importas todo el archivo sin desestructuración
import Header from './components/Header';

const App = () => {
  const [products] = useState(initialProducts); // initialProducts ya es el array de productos
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
  });

  const filterProducts = (products) => {
    return products.filter(product => {
      return (product.price >= filters.minPrice) && (
        filters.category === "all" || product.category === filters.category
      );
    });
  };

  const filteredProducts = filterProducts(products);

  return (
    <>
      <div>Productos</div>
      <Header/>
      <Products products={filteredProducts} />
    </>
  );
};

export default App;
