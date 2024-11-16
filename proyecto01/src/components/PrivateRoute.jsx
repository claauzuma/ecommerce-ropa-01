import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PrivateRoute = ({ children }) => {
  const { setUser, setToken } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setToken(token);
      // Aquí podrías hacer una petición para obtener el usuario con el token, si lo necesitas
    }
  }, [token, setToken]);

  if (!token) {
    console.log("No hay un token");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
