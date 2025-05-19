import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ErrorBoundary>
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default App;