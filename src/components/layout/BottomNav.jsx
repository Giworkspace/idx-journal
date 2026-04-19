import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      name: 'Trades',
      path: '/trades',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      )
    },
    {
      name: 'New',
      path: '/trades/new',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t border-[#E6E8EA] bg-white lg:hidden">
      <div className="flex w-full justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive ? 'text-[#F0B90B]' : 'text-[#848E9C]'
              }`
            }
          >
            {item.icon}
            <span className="mt-1 text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;