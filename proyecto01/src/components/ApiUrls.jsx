// src/constants/apiUrls.js


const urlLocal = 'http://localhost:8080';
const urlServidor = 'http://localhost:8080'; // Si más tarde quieres cambiar la URL, puedes usar esta variable
let url = urlLocal;

const ApiUrls = {
  estadisticas: `${url}/api/estadisticas/`,
  generarCompra: `${url}/api/generar-compra/`,
  login: `${url}/api/usuarios/login`, // Aquí agregamos la URL de login
  productos: `${url}/api/productos`, // URL de productos
  pedidos: `${url}/api/pedidos`, // URL para pedidos
};

export default ApiUrls;
