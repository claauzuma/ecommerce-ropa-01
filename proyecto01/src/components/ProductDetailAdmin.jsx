import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiUrls from './ApiUrls';
import './ProductDetail.css';

const ProductDetailAdmin = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tallesDisponibles, setTallesDisponibles] = useState([]);
  const [selectedTalle, setSelectedTalle] = useState(null);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${ApiUrls.productos}/${productId}`);
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

  const colorTranslations = {
    "rojo": "red",
    "azul": "blue",
    "verde": "green",
    "amarillo": "yellow",
    "negro": "black",
    "blanco": "white",
    // Puedes añadir más colores aquí
  };

  const handleTalleSelect = (talle) => {
    setSelectedTalle(talle);
    setColoresDisponibles(talle.colores.filter((color) => color.stock > 0));
    setSelectedColor(null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Cargando detalles del producto...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail-admin">
      <div className="image-slider">
        <button onClick={goToPreviousImage} className="arrow left">
          &#8592;
        </button>

        <div onClick={openModal} className="mb-0"> {/* Eliminar margen inferior de la imagen */}
          {product.images[currentImageIndex].includes('.mp4') ? (
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
        </div>

        <button onClick={goToNextImage} className="arrow right">
          &#8594;
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {product.images[currentImageIndex].includes('.mp4') ? (
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

      <div className="p-4 text-center mt-2"> {/* Reducir margen superior para acercar más el contenido */}
        <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2> {/* Menor margen inferior */}
        <h3 className="text-xl font-semibold mb-2">{product.descripcion}</h3> {/* Menor margen inferior */}
        <p className="text-xl text-gold font-semibold">Precio: ${product.price}</p>

        {/* Talles */}
        <div className="mt-4">
          <p className="text-lg font-semibold">Selecciona un talle:</p>
          <div className="flex justify-center gap-4 mt-2">
            {tallesDisponibles.map((talle, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg ${
                  selectedTalle === talle ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleTalleSelect(talle)}
              >
                {talle.talle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colores */}
      {selectedTalle && coloresDisponibles.length > 0 && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Selecciona un color:</p>
          <div className="flex justify-center gap-4 mt-2">
            {coloresDisponibles.map((color, index) => {
              console.log("Color recibido:", color); // Esto imprimirá el valor del color cada vez que se renderiza un círculo
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full border cursor-pointer ${
                    selectedColor === color ? 'ring-4 ring-blue-900' : ''
                  }`}
                  style={{ backgroundColor: colorTranslations[color.color] }} // Normaliza a minúsculas
                  onClick={() => handleColorSelect(color)}
                >
                  {/* El color es el fondo del círculo */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailAdmin;
