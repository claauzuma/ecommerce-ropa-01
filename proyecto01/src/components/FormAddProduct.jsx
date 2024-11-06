import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FormAddProduct = () => {
  const { id } = useParams();
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [colores, setColores] = useState([{ nombre: '', stock: '' }]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/productos/${id}`);
          const producto = response.data;
          setDescripcion(producto.descripcion);
          setPrecio(producto.precio);
          setStock(producto.stock);
          if (producto.colores) {
            setColores(producto.colores);
          }
        } catch (error) {
          console.error('Error al cargar el producto:', error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleDescripcionChange = (e) => setDescripcion(e.target.value);
  const handleImagenChange = (e) => setImagen(e.target.files[0]);
  const handlePrecioChange = (e) => setPrecio(e.target.value);

  // Maneja cambios en los colores
  const handleColorChange = (index, field, value) => {
    const newColores = [...colores];
    newColores[index][field] = value;
    setColores(newColores);
  };

  // Añadir un nuevo campo de color
  const handleAddColor = () => {
    setColores([...colores, { nombre: '', stock: '' }]);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen);
    }
    formData.append('precio', precio);
    formData.append('colores', JSON.stringify(colores));

    try {
      if (id) {
        const response = await axios.put(`/api/productos/${id}`, formData);
        console.log('Producto modificado:', response.data);
      } else {
        const response = await axios.post('/api/productos', formData);
        console.log('Producto agregado:', response.data);
      }

      setDescripcion('');
      setImagen(null);
      setPrecio('');
      setColores([{ nombre: '', stock: '' }]);
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

        <h3 className="text-lg font-semibold">Colores:</h3>
        {colores.map((color, index) => (
          <div key={index} className="space-y-2">
            <div>
              <label className="block text-gray-700">Color:</label>
              <input 
                type="text" 
                value={color.nombre} 
                onChange={(e) => handleColorChange(index, 'nombre', e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Stock:</label>
              <input 
                type="number" 
                value={color.stock} 
                onChange={(e) => handleColorChange(index, 'stock', e.target.value)} 
                className="w-full border border-gray-300 p-2 rounded" 
                required 
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddColor}
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Agregar Color
        </button>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4">
          {id ? 'Modificar Producto' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
};

export default FormAddProduct;
