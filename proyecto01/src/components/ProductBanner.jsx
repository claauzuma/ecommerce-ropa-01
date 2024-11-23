import React, { useState, useEffect } from "react";
import axios from "axios";
import ApiUrls from "./ApiUrls";
import './ProductBanner.css'
import { useNavigate } from "react-router-dom";

const ProductBanner = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navHeight, setNavHeight] = useState(0);
  const navigate = useNavigate(); // Instancia de useNavigate

  // Obtener altura del NavBar dinámicamente
  useEffect(() => {
    const navBar = document.querySelector("nav"); // Suponiendo que tu NavBar usa <nav>
    if (navBar) {
      setNavHeight(navBar.offsetHeight);
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
        setCurrentIndex(() => Math.floor(Math.random() * products.length)); // Índice aleatorio
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [products]);

  if (loading) {
    return <div className="text-center text-white">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div
      className="relative text-white h-64 flex items-center justify-center pb-16"
      style={{
        backgroundColor: "#000000",
        paddingTop: `${navHeight - 40}px`,  // Reduce 10px de la altura del NavBar
      }}
      
    >
      <div className="text-center max-w-xl mx-auto space-y-1">


        <h2 className="text-2xl font-bold">{products[currentIndex].nombre}</h2>
        <img
  key={products[currentIndex].id} // Fuerza la re-renderización de la animación
  src={products[currentIndex].image}
  alt={products[currentIndex].nombre}
  className="mx-auto w-full object-contain fade-in" // Clase para animación
  style={{ maxHeight: "200px", maxWidth: "200px", objectFit: "contain" }}
/>


        <button
          className="mt-2 bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
          onClick={() => navigate(`/product/${products[currentIndex].id}`)} // Navegar a la página específica
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default ProductBanner;
