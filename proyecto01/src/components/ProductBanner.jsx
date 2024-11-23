import React, { useState, useEffect } from "react";
import axios from "axios";
import ApiUrls from "./ApiUrls";
import './ProductBanner.css'; // Importa el CSS optimizado
import { useNavigate } from "react-router-dom";
import { FaSpinner } from 'react-icons/fa';

const ProductBanner = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navHeight, setNavHeight] = useState(80); // Valor predeterminado de 80px
  const navigate = useNavigate();

  // Obtener altura del NavBar dinámicamente
  useEffect(() => {
    const navBar = document.querySelector("nav");
    if (navBar) {
      const navHeight = navBar.offsetHeight;
      const reducedHeight = navHeight - 130; // Resta 20px para reducir el espacio
      setNavHeight(reducedHeight);
      document.documentElement.style.setProperty('--nav-height', `${reducedHeight}px`);
    }
  }, []);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(ApiUrls.productos);
        if (!response.data) {
          throw new Error("Error al cargar los productos");
        }
        const formattedData = response.data.map((product) => ({
          nombre: product.nombre,
          description: product.description,
          image: product.images[0],
          stock: product.stock || 0,
          id: product._id,
        }));
        setProducts(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(Math.floor(Math.random() * products.length)); // Índice aleatorio
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="product-banner">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-2xl font-bold">{products[currentIndex].nombre}</h2>
        <img
          key={products[currentIndex].id}
          src={products[currentIndex].image}
          alt={products[currentIndex].nombre}
          className="fade-in"
        />
        <button
          className="mt-2 bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
          onClick={() => navigate(`/product/${products[currentIndex].id}`)}
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default ProductBanner;
