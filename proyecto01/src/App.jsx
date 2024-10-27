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
import PedidoDetail from './components/PedidoDetail';
import Estadisticas from './pages/Admin/EstadisticasVisionGral';
import EstadisticasVentas from './pages/Admin/EstadisticasVentas';
import EstadisticasProductos from './pages/Admin/EstadisticasProductos';



const App = () => {
  return (


  <CartProvider>
    <Router>
  
      <NavBar /> 

      <Routes>

        <Route path="/" element={<IndexProd />} />
        <Route path="/addproduct" element={<FormAddProduct />} />
        <Route path="/loginpage" element={<LoginForm/>} />
        <Route path="/admin/pedidos" element={<Pedidos />} /> 
        <Route path="/admin/form-product" element={<FormProduct />} />
        <Route path="/admin/form-product/:id" element={<FormProduct />} />
        <Route path="/admin/index-product" element={<Index />} />
        <Route path="/cart" element={<Carrito />} />
        <Route path="/product/:productId" element={<ProductDetail/>} /> 
        <Route path="/generar-compra" element={<GenerarCompra />} /> 
        <Route path="/pedido/detail/:id" element={<PedidoDetail />} /> 
        <Route path="/admin/estadisticas/vision-general" element={<Estadisticas />} /> 
        <Route path="/admin/estadisticas/ventas" element={<EstadisticasVentas />} /> 
        <Route path="/admin/estadisticas/productos" element={<EstadisticasProductos />} /> 


      </Routes>
      <Carrito /> 
    </Router>
  </CartProvider>
  
  );
};

export default App;
