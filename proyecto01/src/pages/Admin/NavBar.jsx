import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import Imagen from '../../assets/logo.png'

const NavBarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleStats = () => {
    setIsStatsOpen(!isStatsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log("Token eliminado");
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStatsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black fixed top-0 w-full p-4 shadow-md z-50">
    <div className="container mx-auto flex justify-between items-center">
      {/* Contenedor para el logo y el título */}
      <div className="flex items-center space-x-3">
      <img
  src={Imagen} // Cambia esto al path real de tu logo
  alt="Admin Logo"
  style={{
    width: '32px', // Ancho fijo en píxeles
    height: '32px', // Altura fija en píxeles
    objectFit: 'contain', // Mantener proporción del logo
  }}
/>

        <div className="text-yellow-400 text-2xl font-bold">Admin Panel</div>
      </div>
  
      {/* Botón de menú móvil */}
      <button
        className="md:hidden text-yellow-400 focus:outline-none"
        onClick={toggleMenu}
      >
        {isOpen ? '✖' : '☰'}
      </button>
  
      {/* Opciones del navbar */}
      <ul
        className={`md:flex md:space-x-6 absolute md:relative bg-black w-full md:w-auto transition-all duration-300 ${
          isOpen ? 'top-16' : '-top-48 md:top-0'
        }`}
      >
        <li>
          <a
            href="/admin/index-product"
            className="block text-yellow-400 hover:text-yellow-300 transition-colors duration-300 p-2"
          >
            Mis Productos
          </a>
        </li>
        <li>
          <a
            href="/admin/pedidos"
            className="block text-yellow-400 hover:text-yellow-300 transition-colors duration-300 p-2"
          >
            Pedidos
          </a>
        </li>
        <li className="nav-item dropdown" ref={dropdownRef}>
          <button
            onClick={toggleStats}
            className="block text-yellow-400 hover:text-yellow-300 transition-colors duration-300 p-2 dropdown-toggle"
            id="navbarDropdown"
            aria-expanded={isStatsOpen}
          >
            Estadísticas
          </button>
          <ul
            className={`dropdown-menu ${
              isStatsOpen ? 'show' : ''
            } bg-black text-yellow-400`}
          >
            <li>
              <a
                href="/admin/estadisticas/vision-general"
                className="dropdown-item text-yellow-500 hover:text-yellow-300 transition-colors duration-300"
              >
                Visión General
              </a>
            </li>
            <li>
              <a
                href="/admin/estadisticas/productos"
                className="dropdown-item text-yellow-500 hover:text-yellow-300 transition-colors duration-300"
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href="/admin/estadisticas/ventas"
                className="dropdown-item text-yellow-500 hover:text-yellow-300 transition-colors duration-300"
              >
                Ingresos
              </a>
            </li>
          </ul>
        </li>
  
        <li>
          <button
            onClick={handleLogout}
            className="block text-yellow-400 hover:text-red-400 transition-colors duration-300 p-2"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  </nav>
  
  );
};

export default NavBarAdmin;
