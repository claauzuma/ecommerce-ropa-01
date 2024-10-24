import React, { useState, useId, useEffect } from 'react';
import './Filters.css';
import axios from 'axios'

/* eslint-disable-next-line react/prop-types */
const Filters = ({ onChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const minPriceFilterId = useId();
  const categoryFilterId = useId();
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [products, setProducts] = useState([]); // Estado para almacenar las categorías

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/productos'); // Cambia esta URL a tu API
        setProducts(response.data); // Establece los productos obtenidos en el estado

        // Extrae las categorías únicas de los productos
        const uniqueCategories = [
          ...new Set(response.data.map(product => product.categoria))
        ];
        setCategories(uniqueCategories); // Almacena las categorías únicas en el estado
      } catch (error) {
        console.error('Error fetching products:', error); // Manejo de errores
      }
    };

    fetchProducts(); // Llama a la función para obtener productos
  }, []); // El array vacío [] significa que se ejecutará una vez al montar el componente

  const handleChangeMinPrice = (event) => {
    setMinPrice(event.target.value);
    onChange((prevState) => ({
      ...prevState,
      minPrice: event.target.value,
    }));
  };

  const handleChangeCategory = (event) => {
    onChange((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md mx-auto max-w-3xl">
      <div className="flex flex-col mb-4 md:mb-0">
        <label htmlFor={minPriceFilterId} className="block text-lg font-semibold mb-1">
          Precio
        </label>
        <input
          type="range"
          id={minPriceFilterId}
          min="0"
          max="80000"
          onChange={handleChangeMinPrice}
          className="h-2 bg-gray-300 rounded-lg"
        />
        <span className="text-lg">${minPrice}</span>
      </div>

      <div className="flex flex-col">
        <label htmlFor="categoryFilterId" className="block text-lg font-semibold mb-1">
          Categoría
        </label>
        <select
          id="categoryFilterId"
          onChange={handleChangeCategory}
          className="p-2 border border-gray-300 rounded-lg"
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

export default Filters;
