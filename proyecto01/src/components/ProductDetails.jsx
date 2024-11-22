import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';
import { useNavigate } from 'react-router-dom';
import ApiUrls from './ApiUrls';

const ProductDetail = () => {
  const { addToCart } = useCart();
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newName, setNewName] = useState('');
const [newEmail, setNewEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${ApiUrls.productos}/${productId}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        const data = await response.json();
        setProduct(data);
        setTallesDisponibles(data.talles);
        setComments(data.comments || []);  // Suponiendo que el producto tiene un array de comentarios
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

  const handleAddToCart = () => {
    if (!selectedTalle || !selectedColor) {
      alert('Por favor, selecciona un talle y un color antes de agregar al carrito.');
      return;
    }

    addToCart({ ...product, selectedTalle, selectedColor });
    navigate('/');
  };

  const handleAddComment = () => {
    if (!newComment || !newName || !newEmail) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    
    const newCommentObj = { 
      name: newName,
      email: newEmail,
      text: newComment,
      date: new Date().toLocaleString(),
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    setNewName('');
    setNewEmail('');
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (loading) return <p>Cargando detalles del producto...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail">
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

      <div className="p-4 text-center mt-[-40px]">
        <h2 className="text-2xl font-bold mb-2 product-name">{product.nombre}</h2>
        <h3 className="text-xl font-semibold mb-2">{product.descripcion}</h3>
        <p className="text-xl text-gold font-semibold">{product.price}</p>

        {/* Talles */}
        <div className="mt-2">
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
        <div className="mt-0">
          <p className="text-lg font-semibold">Selecciona un color:</p>
          <div className="flex justify-center gap-4 mt-2">
            {coloresDisponibles.map((color, index) => {
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full border cursor-pointer ${
                    selectedColor === color ? 'ring-4 ring-blue-900' : ''
                  }`}
                  style={{ backgroundColor: colorTranslations[color.color] }}
                  onClick={() => handleColorSelect(color)}
                />
              );
            })}
          </div>
        </div>
      )}

      <button
        className="mt-4 bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg"
        onClick={handleAddToCart}
      >
        Agregar al carrito
      </button>

      {/* Sección de comentarios */}
      <div className="mt-6">
        <button
          className="text-blue-900 font-semibold"
          onClick={toggleComments}
        >
          {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
        </button>

        {showComments && (
          <div className="comments-section mt-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment p-2 border-b border-gray-200">
                  <p className="font-semibold">{comment.date}</p>
                  <p>{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No hay comentarios aún.</p>
            )}
          </div>
        )}

<div className="mt-4">
  <input
    className="border border-gray-300 p-2 w-full mb-2"
    type="text"
    placeholder="Nombre"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
  />
  <input
    className="border border-gray-300 p-2 w-full mb-2"
    type="email"
    placeholder="Email"
    value={newEmail}
    onChange={(e) => setNewEmail(e.target.value)}
  />
  <textarea
    className="border border-gray-300 p-2 w-full"
    placeholder="Escribe tu comentario..."
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
  />
  <button
    className="mt-2 bg-blue-900 text-white py-2 px-4 rounded-lg"
    onClick={handleAddComment}
  >
    Agregar comentario
  </button>
</div>
      </div>
    </div>
  );
};

export default ProductDetail;
