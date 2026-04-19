import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  dark = false,
  padding = 'p-5'
}) => {
  const baseStyles = `${padding} rounded-card transition-all duration-200 ease-in-out`;
  const themeStyles = dark 
    ? 'bg-dark-card text-white' 
    : 'bg-white border border-border-light text-ink shadow-subtle';
  const hoverStyles = hoverable && !dark ? 'hover:shadow-medium' : '';

  return (
    <div className={`${baseStyles} ${themeStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
