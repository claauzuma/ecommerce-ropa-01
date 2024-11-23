// src/constants/apiUrls.js


const urlLocal = 'http://localhost:8080';
const urlServidor = 'https://ecommerce-ropa-nodejs-production.up.railway.app';
let url = urlServidor;

const ApiUrls = {
  estadisticas: `${url}/api/estadisticas/`,
  generarCompra: `${url}/api/generar-compra/`,
  login: `${url}/api/usuarios/login`, // Aquí agregamos la URL de login
  productos: `${url}/api/productos`, // URL de productos
  pedidos: `${url}/api/pedidos`, // URL para pedidos
  comentariosProducto: (productId) => `${url}/api/productos/comentario/${productId}`, // URL dinámica para comentarios de un producto
};

export default ApiUrls;
