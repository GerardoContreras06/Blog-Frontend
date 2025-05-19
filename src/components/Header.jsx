import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          AprendeBlog
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary font-medium">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary font-medium">
                Acerca de
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary font-medium">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;