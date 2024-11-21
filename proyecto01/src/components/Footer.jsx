import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Sobre Nosotros</h4>
          <ul>
            <li><a href="/acerca-de">Quiénes Somos</a></li>
            <li><a href="/mision">Nuestra Misión</a></li>
            <li><a href="/valores">Nuestros Valores</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Ayuda</h4>
          <ul>
            <li><a href="/envios">Envíos</a></li>
            <li><a href="/devoluciones">Devoluciones</a></li>
            <li><a href="/faq">Preguntas Frecuentes</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Redes Sociales</h4>
          <ul className="social-links">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <a href="/">LogoEcommerce</a>
        </div>
        <div className="footer-copy">
          <p>&copy; 2024 LogoEcommerce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
