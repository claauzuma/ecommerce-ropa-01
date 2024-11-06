import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Hook para agregar al carrito
import './ProductDetail.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { productId } = useParams(); // Obtener el id del producto de la URL
  const [product, setProduct] = useState(null); // Estado local para el producto
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [tallesDisponibles, setTallesDisponibles] = useState([]); // Estado para los talles disponibles
  const [selectedTalle, setSelectedTalle] = useState(null); // Estado para el talle seleccionado
  const [coloresDisponibles, setColoresDisponibles] = useState([]); // Estado para los colores disponibles
  const [selectedColor, setSelectedColor] = useState(null); // Estado para el color seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado del slider de imágenes

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${productId}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        const data = await response.json();
        setProduct(data);
        setTallesDisponibles(data.talles);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleTalleSelect = (talle) => {
    setSelectedTalle(talle);
    setColoresDisponibles(talle.colores.filter(color => color.stock > 0));
    setSelectedColor(null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Slider de imágenes
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Alternar el estado del modal
  };

  const handleAddToCart = () => {
    if (!selectedTalle || !selectedColor) {
      alert("Por favor, selecciona un talle y un color antes de agregar al carrito.");
      return;
    }

    // Agregar el producto, talle y color seleccionados al carrito
    addToCart({ ...product, selectedTalle, selectedColor });
    navigate('/');
  };

  if (loading) return <p>Cargando detalles del producto...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail">
      {/* Slider de imágenes */}
      <div className="image-slider">
        <button onClick={goToPreviousImage} className="arrow left">&#8592;</button>
        
        {/* Verificar si es imagen o video */}
        {product.images[currentImageIndex].includes(".mp4") ? (
          <video
            src={product.images[currentImageIndex]}
            className="product-image"
            controls
          />
        ) : (
          <img
            src={product.images[currentImageIndex]}
            alt={product.nombre}
            className="product-image"
          />
        )}

        <button onClick={goToNextImage} className="arrow right">&#8594;</button>
      </div>

      {/* Botón para agrandar/disminuir imagen */}
      <div className="image-controls text-center mt-2">
        <button 
          className="expand-button bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={toggleModal}
        >
          {isModalOpen ? 'Disminuir imagen' : 'Agrandar imagen'}
        </button>
      </div>

      {/* Modal para vista ampliada */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={toggleModal} className="close-button">×</button>
            {product.images[currentImageIndex].includes(".mp4") ? (
              <video
                src={product.images[currentImageIndex]}
                className="modal-image"
                controls
                autoPlay
              />
            ) : (
              <img
                src={product.images[currentImageIndex]}
                alt={product.nombre}
                className="modal-image"
              />
            )}
          </div>
        </div>
      )}

      {/* Resto del contenido */}
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold">{product.nombre}</h2>
        <h3 className="text-xl font-semibold">{product.descripcion}</h3>
        <p className="text-xl text-gold font-semibold">Precio: ${product.price}</p>

        {/* Talles */}
        <div className="mt-4">
          <p className="text-lg font-semibold">Selecciona un talle:</p>
          <div className="flex justify-center gap-4 mt-2">
            {tallesDisponibles.map((talle, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg ${selectedTalle === talle ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleTalleSelect(talle)}
              >
                {talle.talle}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        {selectedTalle && coloresDisponibles.length > 0 && (
          <div className="mt-4">
            <p className="text-lg font-semibold">Colores disponibles:</p>
            <div className="flex justify-center gap-4 mt-2">
              {coloresDisponibles.map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full border cursor-pointer ${selectedColor === color ? 'ring-4 ring-green-500' : ''}`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        )}

        <button 
          className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
