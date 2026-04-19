import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      name: 'Trade Log',
      path: '/trades',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      )
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    },
    {
      name: 'Goals',
      path: '/goals',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      )
    },
    {
      name: 'New Trade',
      path: '/trades/new',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      )
    }
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-60 flex-col border-r border-[#E6E8EA] bg-white lg:flex z-50">
      <div className="flex items-center gap-2 px-6 py-8">
        <span className="text-2xl">📊</span>
        <h1 className="text-2xl font-bold">
          <span className="text-[#F0B90B]">IDX</span>
          <span className="text-[#1E2026]">Journal</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? 'bg-[#F0B90B]/10 text-[#F0B90B]'
                  : 'text-[#32313A] hover:bg-[#F5F5F5]'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <p className="text-xs text-[#848E9C]">IDX Trading Journal v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;