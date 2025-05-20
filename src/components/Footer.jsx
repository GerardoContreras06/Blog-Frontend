import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} Blog de Aprendizaje. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;