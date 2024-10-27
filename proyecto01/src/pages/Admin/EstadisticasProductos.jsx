import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import './EstadisticasProductos.css';
import PropTypes from 'prop-types';

const Productos = () => {
  // Datos de ejemplo para productos
  const productsData = [
    { id: 1, nombre: 'Producto A', stock: 5, visitas: 120, vendidos: 200 },
    { id: 2, nombre: 'Producto B', stock: 50, visitas: 300, vendidos: 50 },
    { id: 3, nombre: 'Producto C', stock: 2, visitas: 400, vendidos: 100 },
    { id: 4, nombre: 'Producto D', stock: 10, visitas: 150, vendidos: 25 },
    { id: 5, nombre: 'Producto E', stock: 1, visitas: 500, vendidos: 300 },
    // Agrega más productos según sea necesario
  ];

  // Funciones para filtrar los productos
  const bajoStock = productsData.filter(product => product.stock < 10);
  const masVisitados = [...productsData].sort((a, b) => b.visitas - a.visitas);
  const masVendidos = [...productsData].sort((a, b) => b.vendidos - a.vendidos);
  const menosVendidos = [...productsData].sort((a, b) => a.vendidos - b.vendidos);

  // Componente para renderizar una tabla
  const ProductTable = ({ title, products }) => (
    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-header text-center">
          <h5>{title}</h5>
        </div>
        <div className="card-body table-container">
          <table className="table table-striped table-hover">
            <thead className="thead-light">
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Visitas</th>
                <th>Vendidos</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.nombre}</td>
                  <td>{product.stock}</td>
                  <td>{product.visitas}</td>
                  <td>{product.vendidos}</td>
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
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
        visitas: PropTypes.number.isRequired,
        vendidos: PropTypes.number.isRequired,
      })
    ).isRequired,
  };
  
  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          {/* Tabla de productos con bajo stock */}
          <ProductTable title="Con Bajo Stock" products={bajoStock} />
          
          {/* Tabla de productos más visitados */}
          <ProductTable title="Más Visitados" products={masVisitados} />
          
          {/* Tabla de productos más vendidos */}
          <ProductTable title="Más Vendidos" products={masVendidos} />
          
          {/* Tabla de productos menos vendidos */}
          <ProductTable title="Menos Vendidos" products={menosVendidos} />
        </div>
      </div>
    </>
  );
};

export default Productos;
