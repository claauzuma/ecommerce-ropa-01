import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PrivateRouteNoToken = () => {
  const { setToken } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Solo actualizamos el token si existe
      console.log("Token encontrado, redirigiendo a admin/index-product");
      setToken(token); // Establece el token en el contexto solo después del primer renderizado
    }
  }, [token, setToken]);

  if (token) {
    // Si existe el token, redirigimos a la página principal del admin
    return <Navigate to="/admin/index-product" replace />;
  }

  // Si no hay token, renderizamos los componentes hijos de esta ruta.
  return <Outlet />;
};

PrivateRouteNoToken.propTypes = {
  children: PropTypes.node, // Eliminamos isRequired ya que no siempre recibe children
};

export default PrivateRouteNoToken;
