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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${productId}`); // Realiza la solicitud al backend
        console.log("El product id es " + productId);
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        const data = await response.json(); // Parsear la respuesta a JSON
        setProduct(data); // Guardar el producto en el estado
      } catch (error) {
        setError(error.message); // Guardar el error en caso de que ocurra
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    const cargarVisitaProducto = async () => {
        try {
      
            const hoy = new Date();
            const fechaHoy = hoy.toISOString().split('T')[0];
    
            const datosVisita = {
                fecha: fechaHoy, 
                visitasProductos: 1,
            };

    
            console.log("Sumamos una visita al producto");
            const respuesta = await axios.post('http://localhost:8080/api/estadisticas/', datosVisita);
          
    
            console.log('Respuesta de la API:', respuesta.data);
      
            return respuesta.data;
        } catch (error) {
            console.error('Error al sumar la visita:', error);
            throw error; 
        }
    };



    cargarVisitaProducto()
    fetchProduct();
  }, [productId]);

  if (loading) return <p>Cargando detalles del producto...</p>; // Mostrar mensaje de carga
  if (error) return <p>Error: {error}</p>; // Mostrar mensaje de error si falla
  if (!product) return <p>Producto no encontrado</p>; // En caso de que no haya producto

  return (
    <div className="product-detail">
      <img 
        src={product.image} 
        alt={product.descripcion}
      />
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold">{product.descripcion}</h2>
        <p className="text-xl text-gold font-semibold">Precio: ${product.price}</p>
        <button 
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => {addToCart(product)
            navigate('/')
          } } // Agregar al carrito
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
