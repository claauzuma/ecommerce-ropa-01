import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FormAddProduct = () => {
  const { id } = useParams(); // Extrae el id de los parámetros de la URL
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Efecto para cargar el producto si se está modificando
  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Entra al useEffect")
      if (id) {
        try {
          const response = await axios.get(`/api/productos/${id}`);
          const producto = response.data;
          setDescripcion(producto.descripcion);
          setPrecio(producto.precio);
          setStock(producto.stock);
          // No se establece la imagen aquí, ya que se subirá en el envío del formulario
        } catch (error) {
          console.error('Error al cargar el producto:', error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Maneja el cambio de los campos
  const handleDescripcionChange = (e) => setDescripcion(e.target.value);
  const handleImagenChange = (e) => setImagen(e.target.files[0]);
  const handlePrecioChange = (e) => setPrecio(e.target.value);
  const handleStockChange = (e) => setStock(e.target.value);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Crear un objeto FormData para enviar los datos del producto, incluyendo la imagen
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen); // La imagen es un archivo
    }
    formData.append('precio', precio);
    formData.append('stock', stock);

    try {
      if (id) {
        console.log("Hay un id, vamos a modificarlo")
        const response = await axios.put(`/api/productos/${id}`, formData);
        console.log('Producto modificado:', response.data);
      } else {
        console.log("No hay ningun ID")
        const response = await axios.post('/api/productos', formData);
        console.log('Producto agregado:', response.data);
      }

      // Limpia los campos después de enviar
      setDescripcion('');
      setImagen(null);
      setPrecio('');
      setStock('');
    } catch (error) {
      console.error('Error al procesar el producto:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{id ? 'Modificar Producto' : 'Agregar Producto'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Descripción:</label>
          <input 
            type="text" 
            value={descripcion} 
            onChange={handleDescripcionChange} 
            className="w-full border border-gray-300 p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700">Imagen:</label>
          <input 
            type="file" 
            onChange={handleImagenChange} 
            className="w-full border border-gray-300 p-2 rounded" 
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-gray-700">Precio:</label>
          <input 
            type="number" 
            value={precio} 
            onChange={handlePrecioChange} 
            className="w-full border border-gray-300 p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700">Stock:</label>
          <input 
            type="number" 
            value={stock} 
            onChange={handleStockChange} 
            className="w-full border border-gray-300 p-2 rounded" 
            required 
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {id ? 'Modificar Producto' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
};

export default FormAddProduct;
