import React from 'react';
import Navbar from '../components/layout/Navbar';

const MainLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className={`pt-16 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
