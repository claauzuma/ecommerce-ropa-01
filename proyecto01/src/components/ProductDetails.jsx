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
    console.log(comments)
  }, [comments]);  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${ApiUrls.productos}/${productId}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        const data = await response.json();
        console.log("Vemos la data " ,data)
        console.log("Vemos los comentaroos ", data.comentarios)
        setProduct(data);
        setTallesDisponibles(data.talles);
        setComments(data.comentarios || []);  // Suponiendo que el producto tiene un array de comentarios
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Función para mostrar/ocultar comentarios
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

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

  const handleAddComment = async () => {
    if (!newComment || !newName || !newEmail) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const currentDate = new Date();
    const fecha = currentDate.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
    const hora = currentDate.toTimeString().split(' ')[0]; // Hora en formato HH:MM:SS

    const comentarioData = {
      fecha,
      hora,
      nombre: newName,
      email: newEmail,
      comentario: newComment,
      estado : "pendiente"
    };

    try {
      const response = await fetch(ApiUrls.comentariosProducto(productId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData), // Convertir el objeto a JSON
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      // Si todo salió bien, puedes manejar la respuesta
      const data = await response.json();
      console.log('Comentario agregado:', data);
      alert('Comentario agregado exitosamente!');

      // Actualizar el estado de comentarios con el nuevo comentario
      setComments((prevComments) => [...prevComments, comentarioData]);
      setNewComment('');
      setNewName('');
      setNewEmail('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert('Hubo un problema al agregar el comentario.');
    }
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

        <div onClick={openModal} className="mb-0">
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
    <div key={index} className="comment mb-6 p-6 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-300">
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-semibold text-gray-800">{comment.nombre}</p>
        <p className="text-sm text-gray-500">{comment.fecha} - {comment.hora}</p>
      </div>
      <p className="text-gray-700 mb-4">{comment.comentario}</p>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">No hay comentarios aún.</p>
)}

          </div>
        )}

        <div className="comment-form mt-6">
          <h3 className="text-lg font-semibold">Deja tu comentario</h3>
          <textarea
            placeholder="Escribe tu comentario"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Tu nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Tu email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Agregar comentario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
