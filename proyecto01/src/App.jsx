import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Importa el icono de WhatsApp desde react-icons
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PrivateRoute from './components/PrivateRoute';
import PrivateRouteNoToken from './components/PrivateRouteNoToken';
import Footer from './components/Footer';
import ProductBanner from './components/ProductBanner';
import Cart from './components/Cart';


const App = () => {
  return (
    <CartProvider>
      <Router>
     
        <NavBar /> 
      
        <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="/admin/pedidos" element={<Pedidos />} />
            <Route path="/admin/form-product" element={<FormProduct />} />
            <Route path="/admin/form-product/:id" element={<FormProduct />} />
            <Route path="/admin/index-product" element={<Index />} />
            <Route path="/admin/estadisticas/vision-general" element={<Estadisticas />} />
            <Route path="/admin/estadisticas/ventas" element={<EstadisticasVentas />} />
            <Route path="/admin/estadisticas/productos" element={<EstadisticasProductos />} />
            <Route path="/addproduct" element={<FormAddProduct />} />
            <Route path="/pedido/detail/:id" element={<PedidoDetail />} />
          </Route>

          <Route element={<PrivateRouteNoToken/>}>
            <Route path="/" element={<IndexProd />} />
            <Route path="/loginpage" element={<LoginForm />} />
            <Route path="/cart" element={<Carrito />} />
            <Route path="/product/:productId" element={<ProductDetail />} /> 
            <Route path="/generar-compra" element={<GenerarCompra />} /> 
          </Route>
        </Routes>

    

        {/* Icono de WhatsApp en la esquina inferior derecha */}
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
          <div className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg">
            <FaWhatsapp size={40} color="white" />
          </div>
        </a>

        <Footer />
        <Cart/>
      </Router>
      
    </CartProvider>
  );
};

export default App;
