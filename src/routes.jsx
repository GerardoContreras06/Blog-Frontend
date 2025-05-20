import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicationDetail from './components/PublicationDetail';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/publication/:id" element={<PublicationDetail />} />
      {/* Agregar más rutas según sea necesario */}
    </Routes>
  );
}

export default AppRoutes;