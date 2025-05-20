import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Comments from './pages/Comments';
// Importa el archivo CSS
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comments/:id" element={<Comments />} />
            {/* Otras rutas aquí */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;