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
import ProductDetail from './components/ProductDetails';
import GenerarCompra from './pages/GenerarCompra';
import Pedidos from './pages/Admin/Pedidos';


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
        <Route path="/admin/pedidos" element={<Pedidos />} /> {/* Asegúrate de que el nombre sea consistente */}
        <Route path="/admin/form-product" element={<FormProduct />} />
        <Route path="/admin/form-product/:id" element={<FormProduct />} />
        <Route path="/admin/index-product" element={<Index />} />
        <Route path="/cart" element={<Carrito />} />
        <Route path="/product/:productId" element={<ProductDetail/>} /> {/* Detalle del producto */}
        <Route path="/generar-compra" element={<GenerarCompra />} /> {/* Asegúrate de que el nombre sea consistente */}


        
     
        
      


      </Routes>
      <Carrito /> {/* Componente del carrito siempre accesible */}
    </Router>
  </CartProvider>
  
  );
};

export default App;
