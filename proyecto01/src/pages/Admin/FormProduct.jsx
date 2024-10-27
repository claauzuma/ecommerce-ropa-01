import React, { useState, useEffect } from 'react';
import NavBarAdmin from './NavBar';
import axios from 'axios'; 
import { useParams, useNavigate } from 'react-router-dom'; 

const FormProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    image: null,
    price: '',
    stock: '',
    categoria: '',
    imageUrl: '', // Para almacenar la URL de la imagen si ya existe
  });

  // Efecto para cargar los datos del producto si estamos modificando
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/productos/${id}`);
          const producto = response.data;
          setFormData({
            descripcion: producto.descripcion,
            image: null, 
            price: producto.price,
            stock: producto.stock,
            categoria: producto.categoria,
            imageUrl: producto.imageUrl, // URL de la imagen cargada
          });
        } catch (error) {
          console.error('Error al cargar el producto:', error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Agregar cada campo al FormData
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('categoria', formData.categoria);
      if (formData.image) {
        formDataToSend.append('image', formData.image); 
      }
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);

      if (id) {
        // Modificar el producto
        await axios.put(`http://localhost:8080/api/productos/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        });
        alert('Producto modificado exitosamente');
      } else {
        // Agregar un nuevo producto
        await axios.post('http://localhost:8080/api/productos', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Producto agregado exitosamente');
      }

    
      setFormData({
        descripcion: '',
        categoria: '',
        image: null,
        price: '',
        stock: '',
        imageUrl: '',
      });

  
      navigate('/admin/index-product');
    } catch (e) {
      console.error('Error al agregar/modificar producto:', e);
    }
  };

  return (
    <>
      <NavBarAdmin />
      <div className="flex justify-center items-start p-4 bg-gray-100 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-semibold mb-4 text-center">{id ? 'Modificar Producto' : 'Agregar Producto'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-gray-700 mb-2">Descripción</label>
              <input 
                type="text" 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="categoria" className="block text-gray-700 mb-2">Categoria</label>
              <input 
                type="text" 
                name="categoria" 
                value={formData.categoria}
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">Imagen (JPEG o PNG)</label>
              {formData.imageUrl && (
                <div className="mb-2">
                  <img src={formData.imageUrl} alt="Producto" className="w-full h-40 object-cover rounded" />
                  <p className="text-gray-600">Imagen actual del producto</p>
                </div>
              )}
              <input 
                type="file" 
                name="image" 
                accept="image/jpeg, image/png"
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2">Precio Unitario</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block text-gray-700 mb-2">Stock</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
            >
              {id ? 'Modificar Producto' : 'Agregar Producto'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormProduct;