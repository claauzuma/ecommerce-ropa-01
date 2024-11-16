import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PrivateRouteNoToken = () => {
  const { setToken } = useCart();
  const token = localStorage.getItem('token');

  if (token) {
    // Si existe un token, redirigimos a la ruta específica.
    console.log("Token encontrado, redirigiendo a admin/index-product");
    setToken(token); // Opcional: establecer el token en el contexto si lo necesitas.
    return <Navigate to="/admin/index-product" replace />;
  }

  // Si no hay token, renderizamos los componentes hijos de esta ruta.
  return <Outlet />;
};

PrivateRouteNoToken.propTypes = {
  children: PropTypes.node, // Eliminamos isRequired ya que no siempre recibe children
};

export default PrivateRouteNoToken;
