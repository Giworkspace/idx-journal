import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    success: 'bg-crypto-green bg-opacity-10 text-crypto-green',
    danger: 'bg-crypto-red bg-opacity-10 text-crypto-red',
    yellow: 'bg-binance-yellow text-ink',
    default: 'bg-snow text-slate-text'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
