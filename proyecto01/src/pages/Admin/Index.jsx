import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import ProductsAdmin from '../../components/ProductsAdmin';
import Header from '../../components/Header';
import NavBarAdmin from './NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import { useCart } from '../../context/CartContext.jsx'; // Hook para agregar al carrito



const Index = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
  });
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador
  const navigate = useNavigate();
  const { user } = useCart();

 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/productos'); // Cambia esta URL a tu API
        setProducts(response.data); // Establece los productos obtenidos en el estado

      } catch (error) {
        console.error('Error fetching products:', error); // Manejo de errores
      }
    };

    fetchProducts(); // Llama a la función para obtener productos
  }, []); // El array vacío [] significa que se ejecutará una vez al montar el componente

  // Función para filtrar los productos en base a categoría, precio y búsqueda
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
  };

  return (
    <>
    <NavBarAdmin/>
    <br />
    <br />
    <br />
   

      <div className="container mx-auto p-6 mt-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          <button onClick={handleAddProduct} className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
            Agregar producto
          </button>
        </div>
      </div>

      <Header changeFilters={setFilters} />

      <div className="container mx-auto p-6">
        <ProductsAdmin products={filteredProducts} setProducts={setProducts}/>
      </div>
    </>
  );
};

export default Index;
