import React, { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Carrito from '../components/Cart'; // Importa el componente Carrito
import logo from '../assets/logo.png';
import { MdShoppingCart, MdLogin } from 'react-icons/md';
import './NavBar.css';

const NavBar = () => {
  const cartRef = useRef(null);
  const { isCartVisible, setIsCartVisible, token, getCartItemsCount } = useCart();
  const navigate = useNavigate(); // Crear la instancia de navigate

  useEffect(() => {
    console.log("isCartVisible", isCartVisible);
  }, [isCartVisible]);

  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setIsCartVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (token) {
    return null;
  }

  return (
    <nav className="w-full bg-gradient-to-r from-black via-dark-blue to-black p-3 shadow-lg border-b-4 border-gold">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="h-full object-contain"
            style={{ maxHeight: '140px' }} // Mantén el tamaño del logo
          />
        </a>

        <div className="flex-grow text-center">
          <span className="text-white font-extrabold" style={{ fontSize: '3rem', fontFamily: 'Charmonman, cursive' }}>
            Blessed Store
          </span>
        </div>

        <div className="space-x-4 flex items-center">
          <button
            onClick={() => navigate('/loginpage')} // Usar navigate en lugar de href
            className="text-white hover:text-gold transition duration-300 ease-in-out"
          >
            <MdLogin size={24} />
          </button>

          <button
            onClick={() => setIsCartVisible(true)}
            className="relative flex items-center justify-center"
          >
            <MdShoppingCart size={40} className="text-white" />  {/* Aumenté el tamaño del icono */}
            {getCartItemsCount() > 0 && (
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
