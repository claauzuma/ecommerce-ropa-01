import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import './EstadisticasProductos.css';
import PropTypes from 'prop-types';
import axios from 'axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [productosConVentas, setProductosConVentas] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [productosMenosVendidos, setProductosMenosVendidos] = useState([]);
    const [productosOrdenados, setProductosOrdenados] = useState([]);
    const topProductsCount = 50;

    useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await axios.get('http://localhost:8080/api/productos');
              const data = response.data;
              const productosOrdenados = data.sort((a, b) => a.stock - b.stock);
              setProductos(productosOrdenados);
              setProductosOrdenados(productosOrdenados); 
              console.log(productosOrdenados);
          } catch (error) {
              console.error('Error al obtener los productos:', error);
          }
      };

      const fetchPedidos = async () => {
          try {
              const response = await axios.get('http://localhost:8080/api/pedidos');
              const data = response.data;
              setPedidos(data);
              console.log(data);
          } catch (error) {
              console.error('Error al obtener los pedidos:', error);
          }
      };

      fetchProducts();
      fetchPedidos();
  }, []); 

  useEffect(() => {
      if (pedidos.length > 0) {
          console.log("HAY PEDIDOSSSSSSS MUCHACHOSSS");
          console.log(pedidos)
          fetchProductosVenta();
      }
  }, [pedidos]); 

  const fetchProductosVenta = () => {
    console.log("Ahora fetcheamos los productos ventas")
      let productosVentas = [];

      pedidos.forEach(pedido => {
          if (pedido.despachado) {
            console.log("Pasamos por el pedido de id " + pedido._id)
              pedido.productos.forEach(producto => {
                  const indice = dameIndice(productosVentas,producto.descripcion);
                  
                  if (indice >= 0) {
                    console.log("Producto" + producto.descripcion + "Hay un producto ya con este nombre, le sumamos la cantidad de " +producto.cantidad)
                      productosVentas[indice].cantidad += producto.cantidad;
                  } else {
                    console.log("Producto" + producto.descripcion + "No hay un producto con este nombre, asi que creamos un nuevo producto " + producto.descripcion)
                      let nuevoProducto = { nombre: producto.descripcion, cantidad: producto.cantidad };
                      productosVentas.push(nuevoProducto);
                  }
              });
          }
      });



      setProductosConVentas(productosVentas);

      
      if (productosVentas.length === 0) {
          setProductosMasVendidos([]);
          setProductosMenosVendidos([]);
          return; 
      }

      const sortedProductos = [...productosVentas].sort((a, b) => b.cantidad - a.cantidad);
     

      const masVendidos = sortedProductos.slice(0, topProductsCount);
      const menosVendidos = sortedProductos.slice(-topProductsCount);

      setProductosMasVendidos(masVendidos);
      setProductosMenosVendidos(menosVendidos);
  };

  const dameIndice = (productosVentas,descripcion) => {
      return productosVentas.findIndex(producto => producto.nombre === descripcion);
  };


  useEffect(() => {
      console.log("PRODUCTOS ACTUALIZADOS:", productos);
  }, [productos]);

  useEffect(() => {
    console.log("PRODUCTOS CON VENTAS ACTUALIZADOS :", productosConVentas);
 }, [productosConVentas]);

useEffect(() => {
  console.log("PRODUCTOS ACTUALIZADOS MAS VENDIDOS:", productosMasVendidos);
  const menosvendidos = productosConVentas.sort((a, b) => a.cantidad - b.cantidad); // Ordenar de menor a mayor
  setProductosMenosVendidos(menosvendidos)

 }, [productosMasVendidos]);

useEffect(() => {
  console.log("PRODUCTOS ACTUALIZADOS MENOS VENDIDOS:", productosMenosVendidos);
  
 }, [productosMenosVendidos]);




const ProductTable = ({ title, products, columns }) => (
  <div className="col-md-6 mb-4">
    <div className="card h-100" style={{ borderColor: 'rgba(212, 175, 55, 1)' }}>
      <div className="card-header text-center" style={{ backgroundColor: '#000000' }}>
        <h5 className="table-header">{title}</h5>
      </div>
      <div className="card-body table-container">
        <table className="table table-striped table-hover">
          <thead className="thead-light">
            <tr>
              {columns.map((col) => (
                <th key={col} className="table-header">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                {columns.includes('Descripcion') && <td className="table-data">{product.descripcion || product.nombre}</td>}
                {columns.includes('Stock') && <td className="table-data">{product.stock}</td>}
                {columns.includes('Precio') && <td className="table-data">{product.price}</td>}
                {columns.includes('Vendidos') && <td className="table-data">{product.cantidad}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
ProductTable.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
      PropTypes.shape({
          _id: PropTypes.string.isRequired,
          descripcion: PropTypes.string,
          stock: PropTypes.number,
          price: PropTypes.number,
          visitas: PropTypes.number,
          vendidos: PropTypes.number,
      })
  ).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

return (
  <>
      <NavBar />

      <div className="container mt-5">
          <div className="row">
              {/* Tabla de productos con bajo stock */}
              <ProductTable title="Con Bajo Stock" products={productosOrdenados.filter(p => p.stock < 15)} columns={['Descripcion', 'Stock', 'Precio']} />
              
              {/* Otras tablas usando `productosOrdenados` */}
              <ProductTable title="Más Visitados" products={productosOrdenados} columns={['Descripcion', 'Stock', 'Precio']} />
              <ProductTable title="Más Vendidos" products={productosMasVendidos} columns={['Descripcion', 'Vendidos']} />
              <ProductTable title="Menos Vendidos" products={productosMenosVendidos} columns={['Descripcion','Vendidos']} />
          </div>
      </div>
  </>
);
}

export default Productos;
