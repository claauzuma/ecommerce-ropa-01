import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PrivateRoute = () => {
  const { setUser, setToken } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setToken(token); // Establece el token en el contexto solo después de la primera renderización
      // Aquí podrías hacer una petición para obtener el usuario con el token si lo necesitas
    }
  }, [token, setToken]);  // Dependemos del token y setToken para ejecutar el efecto correctamente

  if (!token) {
    console.log("No hay un token");
    return <Navigate to="/" replace />; // Si no hay token, redirige al login
  }

  return <Outlet />; // Si hay token, muestra los componentes hijos
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
