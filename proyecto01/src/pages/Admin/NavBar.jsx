import React, { useState } from 'react';

const NavBarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          {/* Icono del menú (puedes usar cualquier icono o texto) */}
          {isOpen ? '✖' : '☰'}
        </button>

        {/* Opciones del NavBar */}
        <ul
          className={`md:flex md:space-x-6 absolute md:relative bg-blue-600 w-full md:w-auto transition-all duration-300 ${
            isOpen ? 'top-16' : '-top-48 md:top-0'
          }`}
        >
          <li>
            <a href="/admin/index-product" className="block text-white hover:text-gray-200 transition-colors duration-300 p-2">
              Mis Productos
            </a>
          </li>
          <li>
            <a href="/pedidos" className="block text-white hover:text-gray-200 transition-colors duration-300 p-2">
              Pedidos
            </a>
          </li>
          <li>
            <a href="/logout" className="block text-white hover:text-red-400 transition-colors duration-300 p-2">
              Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarAdmin;
