import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-pearlstay-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;