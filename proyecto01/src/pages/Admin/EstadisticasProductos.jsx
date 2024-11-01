import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import './EstadisticasProductos.css';
import PropTypes from 'prop-types';
import axios from 'axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const [productosConVentas, setProductosConVentas] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [productosMenosVendidos, setProductosMenosVendidos] = useState([]);
    const [productosClickeados, setProductosClickeados] = useState([]);
    const [productosOrdenadosMasClickeados, setProductosOrdenadosMasClickeados] = useState([]);
    const [loading, setLoading] = useState(true);

    const topProductsCount = 50;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productosResponse, pedidosResponse, estadisticasResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/productos'),
                axios.get('http://localhost:8080/api/pedidos'),
                axios.get('http://localhost:8080/api/estadisticas'),
            ]);
            setProductos(productosResponse.data.sort((a, b) => a.stock - b.stock));
            setPedidos(pedidosResponse.data);
            setEstadisticas(estadisticasResponse.data.data);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); 

    useEffect(() => {
        if (pedidos.length > 0) {
            fetchProductosVenta();
        }
    }, [pedidos]); 

    const fetchProductosVenta = () => {
        let productosVentas = [];

        pedidos.forEach(pedido => {
            if (pedido.despachado) {
                pedido.productos.forEach(producto => {
                    const indice = dameIndice(productosVentas, producto.descripcion);
                    if (indice >= 0) {
                        productosVentas[indice].cantidad += producto.cantidad;
                    } else {
                        productosVentas.push({ nombre: producto.descripcion, cantidad: producto.cantidad });
                    }
                });
            }
        });

        setProductosConVentas(productosVentas);

        const sortedProductos = [...productosVentas].sort((a, b) => b.cantidad - a.cantidad);
        setProductosMasVendidos(sortedProductos.slice(0, topProductsCount));
        setProductosMenosVendidos(sortedProductos.slice(-topProductsCount));
    };

    const dameIndice = (productosVentas, descripcion) => {
        return productosVentas.findIndex(producto => producto.nombre === descripcion);
    };

    useEffect(() => {
        const productosClickeadosCopia = productos.map(producto => ({
            ...producto,
            click: 0,
        }));

        if (estadisticas && Array.isArray(estadisticas) && estadisticas.length > 0) {
            estadisticas.forEach(estadistica => {
                estadistica.idProductosBuscados.forEach(objeto => {
                    const producto = productosClickeadosCopia.find(p => p._id === objeto.id);
                    if (producto) {
                        producto.click += objeto.cantidad;
                    }
                });
            });

            const productosOrdenados = [...productosClickeadosCopia].sort((a, b) => b.click - a.click);
            setProductosClickeados(productosClickeadosCopia);
            setProductosOrdenadosMasClickeados(productosOrdenados);
        }
    }, [estadisticas, productos]);

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
                                    {columns.includes('Visitas') && <td className="table-data">{product.click}</td>}
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

    if (loading) {
        return <div>Cargando...</div>; 
    }

    return (
        <>
            <NavBar />
            <div className="container mt-5">
                <div className="row">
                    <ProductTable title="Con Bajo Stock" products={productos.filter(p => p.stock < 15)} columns={['Descripcion', 'Stock', 'Precio']} />
                    <ProductTable title="Más Visitados" products={productosOrdenadosMasClickeados} columns={['Descripcion', 'Visitas']} />
                    <ProductTable title="Más Vendidos" products={productosMasVendidos} columns={['Descripcion', 'Vendidos']} />
                    <ProductTable title="Menos Vendidos" products={productosMenosVendidos} columns={['Descripcion','Vendidos']} />
                </div>
            </div>
        </>
    );
};

export default Productos;
