import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <Header />

      {/* Main Content Area */}
      <main className="lg:ml-60 pb-20 lg:pb-0">
        <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
