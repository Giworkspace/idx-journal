import React from 'react';

const Button = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  disabled = false, 
  onClick, 
  type = 'button', 
  ...rest 
}) => {
  const baseStyles = 'px-4 py-2 transition-all duration-200 ease-in-out font-medium flex items-center justify-center';
  
  const variants = {
    primary: 'bg-binance-yellow text-ink rounded-btn hover:bg-focus-blue hover:text-white active:bg-active-yellow',
    pill: 'bg-binance-gold text-white rounded-pill shadow-pill hover:bg-focus-blue active:bg-active-yellow',
    secondary: 'bg-white border border-binance-yellow text-binance-yellow rounded-pill hover:bg-focus-blue hover:text-white active:bg-active-yellow',
    danger: 'bg-crypto-red text-white rounded-btn hover:bg-red-600 active:bg-red-700'
  };

  const disabledStyles = 'bg-border-light text-slate-text cursor-not-allowed hover:bg-border-light hover:text-slate-text';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${disabled ? disabledStyles : variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
