import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 mt-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">AprendeBlog</h3>
            <p className="text-gray-300">Tu fuente de conocimiento en desarrollo y aprendizaje.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AprendeBlog. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;