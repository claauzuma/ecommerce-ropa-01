import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
const PrivateRoute = ({ children }) => {
 
    const {setUser, user, setToken} = useCart()
    console.log(user)
    const token = localStorage.getItem('token');
    console.log(token)

    if(!token) {
    console.log("No hay un token");
    return <Navigate to="/" replace />;
    }else {

      setToken(token)

    }
    


    return <Outlet/>;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, 

};

export default PrivateRoute;
