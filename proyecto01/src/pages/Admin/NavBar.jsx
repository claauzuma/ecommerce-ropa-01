import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const [isStatsOpen, setIsStatsOpen] = useState(false); // Estado para la sublista de estadísticas

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleStats = () => {
    setIsStatsOpen(!isStatsOpen);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título del NavBar */}
        <div className="text-white text-2xl font-bold">Admin Panel</div>

        {/* Botón para el menú móvil */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? '✖' : '☰'}
        </button>

        {/* Opciones del NavBar */}
        <ul
          className={`md:flex md:space-x-6 absolute md:relative bg-blue-600 w-full md:w-auto transition-all duration-300 ${
            isOpen ? 'top-16' : '-top-48 md:top-0'
          }`}
        >
          <li>
            <a
              href="/admin/index-product"
              className="block text-white hover:text-gray-200 transition-colors duration-300 p-2"
            >
              Mis Productos
            </a>
          </li>
          <li>
            <a
              href="/admin/pedidos"
              className="block text-white hover:text-gray-200 transition-colors duration-300 p-2"
            >
              Pedidos
            </a>
          </li>
          <li className="nav-item dropdown">
            <button
              onClick={toggleStats}
              className="block text-white hover:text-gray-200 transition-colors duration-300 p-2 dropdown-toggle"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded={isStatsOpen}
            >
              Estadísticas
            </button>
            <ul className={`dropdown-menu ${isStatsOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
              <li>
                <a
                  href="/admin/estadisticas/vision-general"
                  className="dropdown-item text-dark hover:text-gray-200 transition-colors duration-300" // Cambia 'text-white' a 'text-dark'
                >
                  Visión General
                </a>
              </li>
              <li>
                <a
                  href="/admin/estadisticas/productos"
                  className="dropdown-item text-dark hover:text-gray-200 transition-colors duration-300" // Cambia 'text-white' a 'text-dark'
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="/admin/estadisticas/ventas"
                  className="dropdown-item text-dark hover:text-gray-200 transition-colors duration-300" // Cambia 'text-white' a 'text-dark'
                >
                  Ingresos
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="/admin/configuracion"
              className="block text-white hover:text-gray-200 transition-colors duration-300 p-2"
            >
              Configuración
            </a>
          </li>
          <li>
            <a
              href="/logout"
              className="block text-white hover:text-red-400 transition-colors duration-300 p-2"
            >
              Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarAdmin;
