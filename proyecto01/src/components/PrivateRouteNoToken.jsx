import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PrivateRouteNoToken = ({ children }) => {
 
    const {setUser, user, setToken} = useCart()
    console.log(user)
    const token = localStorage.getItem('token');
    console.log(token)

    if(token) {
    console.log("No hay un token");
    return <Navigate to="admin/index-product" replace />;
    }

    return <Outlet/>;
}

PrivateRouteNoToken.propTypes = {
  children: PropTypes.node.isRequired, 

};

export default PrivateRouteNoToken;
