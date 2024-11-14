import React, { useRef, useEffect } from 'react';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';

const NavBar = () => {
  const cartRef = useRef(null);
  const { isCartVisible, setIsCartVisible, token } = useCart();


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
              onClick={() => setIsCartVisible(true)}
              className="text-white font-medium text-lg hover:text-gray-300 transition duration-300 ease-in-out"
            >
              🛒 Carrito
            </button>

            <a
              href="/loginpage"
              className="text-white font-medium text-lg hover:text-gray-300 transition duration-300 ease-in-out"
            >
              🔒 Login
            </a>
          </div>
        </div>
      </nav>


      {isCartVisible && <Cart ref={cartRef} />}
    </>
  );
};

export default NavBar;
