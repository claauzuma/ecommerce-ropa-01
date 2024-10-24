import React, { useRef, useEffect } from 'react';
import Cart from '../components/Cart'; // Asegúrate de importar el componente del carrito
import { useCart } from '../context/CartContext'; // Importar correctamente el contexto

const NavBar = () => {
  const cartRef = useRef(null);
  const { isCartVisible, setIsCartVisible } = useCart(); // Tomar isCartVisible y setIsCartVisible del contexto

  // Función para manejar clics fuera del carrito
  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setIsCartVisible(false);
    }
  };

  // Efecto para agregar y limpiar el listener de clics
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            <a href="/" className="hover:text-gray-300 transition duration-300 ease-in-out">
              Inicio
            </a>
          </div>
          <div className="space-x-8">
            <button
              onClick={() => setIsCartVisible(true)} // Corregir paréntesis
              className="text-white font-medium text-lg hover:text-gray-300 transition duration-300 ease-in-out"
            >
              🛒 Carrito
            </button>
            <a href="/loginpage" className="text-white font-medium text-lg hover:text-gray-300 transition duration-300 ease-in-out">
              🔒 Login
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
