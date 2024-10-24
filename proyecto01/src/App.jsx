import React, { useState } from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './components/Products';
import initialProducts from './mocks/Products.json'; 
import Header from './components/Header';
import NavBar from './pages/NavBar';
import FormAddProduct from './components/FormAddProduct';
import IndexProd from './pages/IndexProd';
import FormProduct from './pages/Admin/FormProduct';
import Index from './pages/Admin/Index';
import LoginForm from './pages/LoginForm';
import Carrito from './components/Cart';
import { CartProvider } from './context/CartContext';


const App = () => {
  return (


  <CartProvider>

    <Router>
      {/* El NavBar se mostrará en todas las rutas */}
      <NavBar /> 

      <Routes>
        {/* Renderiza IndexProd cuando estés en la ruta principal "/" */}
        <Route path="/" element={<IndexProd />} />

        {/* Renderiza FormAddProduct cuando estés en la ruta "/addproduct" */}
        <Route path="/addproduct" element={<FormAddProduct />} />

        <Route path="/loginpage" element={<LoginForm/>} />
        <Route path="/admin/form-product" element={<FormProduct />} />
        <Route path="/admin/form-product/:id" element={<FormProduct />} />
        <Route path="/admin/index-product" element={<Index />} />
        <Route path="/cart" element={<Carrito />} />
     
        
       


      </Routes>
      <Carrito /> {/* Componente del carrito siempre accesible */}
    </Router>
  </CartProvider>
  
  );
};

export default App;
