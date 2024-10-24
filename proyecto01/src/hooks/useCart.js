
import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

import React from 'react'

const useCart = () => {

    const cart = useContext(CartContext)

    if(cart == undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }



  return cart
}

export default useCart