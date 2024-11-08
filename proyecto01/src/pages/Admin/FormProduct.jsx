import React, { useState, useEffect } from 'react';
import NavBarAdmin from './NavBar';
import axios from 'axios'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import './FormProduct.css';

const FormProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [originalImages, setOriginalImages] = useState([]); // Imágenes originales del producto

  const colorMapping = {
    rosa: 'pink',
    violeta: 'purple',
    gris: 'gray',
    turquesa: 'turquoise',
    rojo: 'red',
    azul: 'blue',
    verde: 'green',
    amarillo: 'yellow',
    negro: 'black',
    blanco: 'white',
  };
  

  const colorOptions = [
    { label: 'Sin color', value: 'sinColor', colorCode: '#FFFFFF' },
    { label: 'Rosa', value: 'rosa', colorCode: '#FF66B2' },
    { label: 'Violeta', value: 'violeta', colorCode: '#8A2BE2' },
    { label: 'Gris', value: 'gris', colorCode: '#808080' },
    { label: 'Turquesa', value: 'turquesa', colorCode: '#40E0D0' },
    { label: 'Rojo', value: 'rojo', colorCode: '#FF0000' },
    { label: 'Azul', value: 'azul', colorCode: '#0000FF' },
    { label: 'Verde', value: 'verde', colorCode: '#00FF00' },
    { label: 'Amarillo', value: 'amarillo', colorCode: '#FFFF00' },
    { label: 'Negro', value: 'negro', colorCode: '#000000' },
    { label: 'Blanco', value: 'blanco', colorCode: '#FFFFFF' },
  ];
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    price: '',
    tallesInputs: [{ talle: '', colores: [{ color: '', stock: '' }] }],
    categoria: '',
    images: [], // Nuevas imágenes
    originalImages: [], // Imágenes existentes
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/productos/${id}`);
          const producto = response.data;
          setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            price: producto.price,
            tallesInputs: producto.talles.length > 0 ? producto.talles : [{ talle: '', colores: [{ color: '', stock: '' }] }],
            categoria: producto.categoria,
            images: producto.images || [], // Se deja vacío porque `images` se usará solo para nuevas imágenes seleccionadas
          });

        } catch (error) {
          console.error('Error al cargar el producto:', error);
        }
      }
    };
  
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value,  // Cambié para manejar múltiples archivos
    }));
  };

  const handleAddImage = () => {
    console.log("Se abre el archivo")
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, null],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => {
      const newImages = [...prevData.images];
      newImages.splice(index, 1);
      return { ...prevData, images: newImages };
    });
  };

  const handleImageChange = (index, e) => {
    const { files } = e.target;
    setFormData((prevData) => {
      const newImages = [...prevData.images];
      newImages[index] = files[0];
      return { ...prevData, images: newImages };
    });
  };

  const handleAddTalle = () => {
    setFormData((prevData) => ({
      ...prevData,
      tallesInputs: [...prevData.tallesInputs, { talle: '', colores: [{ color: '', stock: '' }] }],  // Mantener la estructura de talles y colores
    }));
  };

  const handleRemoveTalle = (index) => {
    setFormData((prevData) => {
      const newTalles = [...prevData.tallesInputs];
      newTalles.splice(index, 1);
      return { ...prevData, tallesInputs: newTalles };
    });
  };

  const handleTalleChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newTalles = [...prevData.tallesInputs];
      newTalles[index][name] = value;
      return { ...prevData, tallesInputs: newTalles };
    });
  };

  const handleAddColor = (talleIndex) => {
    setFormData((prevData) => {
      const newTalles = [...prevData.tallesInputs];
      newTalles[talleIndex].colores.push({ color: '', stock: '' });
      return { ...prevData, tallesInputs: newTalles };
    });
  };

  const handleRemoveColor = (talleIndex, colorIndex) => {
    setFormData((prevData) => {
      const newTalles = [...prevData.tallesInputs];
      newTalles[talleIndex].colores.splice(colorIndex, 1);
      return { ...prevData, tallesInputs: newTalles };
    });
  };

  const handleColorChange = (talleIndex, colorIndex, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newTalles = [...prevData.tallesInputs];
      newTalles[talleIndex].colores[colorIndex][name] = value;
      return { ...prevData, tallesInputs: newTalles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.price <= 0) {
      alert('El precio debe ser mayor que cero.');
      return;
    }
  
    // Verificar si al menos un talle está vacío o no existe un talle válido
    const hasEmptyTalle = formData.tallesInputs.some(input => input.talle === "");
    const hasValidTalle = formData.tallesInputs.some(input => input.talle !== "");
  
    if (hasEmptyTalle) {
      alert("Hay al menos un campo 'talle' vacío");
      return; // Detiene la ejecución si hay talle vacío
    }
  
    if (!hasValidTalle) {
      alert("Debe haber al menos un talle válido");
      return; // Detiene la ejecución si no hay talle válido
    }

    console.log("El talle es:");
    console.log(formData.tallesInputs);


    

  
    // Verificar que cada talle tenga color y stock
    const hasIncompleteTalle = formData.tallesInputs.some(input => 
      input.talle !== "" && 
      (!input.colores || input.colores.length === 0 || !input.colores[0].stock || !input.colores[0].color)
    );
    
    if (hasIncompleteTalle) {
      alert("Todos los talles deben tener un color y un stock asignado.");
      return; // Detiene la ejecución si algún talle tiene color o stock incompleto
    }


    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('price', formData.price);
  
      // Si hay nuevas imágenes, agrégalas al FormData
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          if (image) {
            formDataToSend.append('images', image);
          }
        });
      } else {
        // Si no hay nuevas imágenes, enviar las URLs de las imágenes originales
        formDataToSend.append('originalImages', JSON.stringify(originalImages));
      }
  
      formDataToSend.append('tallesInputs', JSON.stringify(formData.tallesInputs));
  
      if (id) {
        console.log("VAMOS A MODIFICAR EL PRODUCTO ")
        console.log("LA DATA A modificar ES:");

        // Itera y muestra cada clave y valor en formDataToSend
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }
    
        await axios.put(`http://localhost:8080/api/productos/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Producto modificado exitosamente');
      } 
      
      
      else {
        await axios.post('http://localhost:8080/api/productos', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("LA DATA A agregar ES:");

        // Itera y muestra cada clave y valor en formDataToSend
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }
    
        alert('Producto agregado exitosamente');
      }
  
      navigate('/admin/index-product');
    } catch (e) {
      console.error('Error al agregar/modificar producto:', e);
    }
  };

  return (
    <>
      <NavBarAdmin />
      <div className="flex justify-center items-start p-4 bg-gray-900 mt-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-md w-full border-4 border-black">
          <h1 className="text-2xl font-semibold mb-4 text-white text-center">
            {id ? 'Modificar Producto' : 'Agregar Producto'}
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Campos generales del formulario */}
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
            />
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
            ></textarea>

            {/* Input de categoria */}
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Categoría del producto"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
            />

            {/* Archivos adicionales */}
            <h2 className="text-lg font-semibold mb-2 text-white">Imágenes del producto</h2>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(index, e)}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-600 text-white p-2 rounded-lg ml-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-green-600 text-white p-2 rounded-lg mb-4"
            >
              Agregar archivo <FontAwesomeIcon icon={faPlus} />
            </button>

            {/* Precio */}
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Precio"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
            />

            {/* Talles y colores */}
            <h2 className="text-lg font-semibold mb-2 text-white">Talles</h2>
            {formData.tallesInputs.map((talleInput, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  name="talle"
                  value={talleInput.talle}
                  onChange={(e) => handleTalleChange(index, e)}
                  placeholder={`Talle ${index + 1}`}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
                />
{talleInput.colores.map((colorInput, colorIndex) => (
  <div key={colorIndex} className="flex items-center mb-2">
   <select
  name="color"
  value={colorInput.color}
  onChange={(e) => handleColorChange(index, colorIndex, e)}
  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2"
>
  <option value="">Seleccionar color</option>
  {colorOptions.map((colorOption, i) => (
    <option key={i} value={colorOption.value}>
      {colorOption.label}
    </option>
  ))}
</select>
<div
  className="w-6 h-6 ml-2 rounded-full"
  style={{ backgroundColor: colorInput.color ? colorOptions.find(color => color.value === colorInput.color)?.colorCode : '#ffffff' }}
></div>
    <input
      type="number"
      name="stock"
      value={colorInput.stock}
      onChange={(e) => handleColorChange(index, colorIndex, e)}
      placeholder="Stock"
      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white mb-2 ml-2"
    />
    <button
      type="button"
      onClick={() => handleRemoveColor(index, colorIndex)}
      className="bg-red-600 text-white p-2 rounded-lg ml-2"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </div>
))}
                <button
                  type="button"
                  onClick={() => handleAddColor(index)}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  Agregar color
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveTalle(index)}
                  className="bg-red-600 text-white p-2 rounded-lg ml-2"
                >
                  Eliminar talle
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTalle}
              className="bg-blue-600 text-white p-2 rounded-lg mb-4"
            >
              Agregar talle
            </button>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded-lg mt-4"
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
