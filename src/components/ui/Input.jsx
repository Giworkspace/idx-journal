import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...rest 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-3 py-2 bg-white border rounded-input text-ink focus:border-black outline-none transition-all duration-200 ${
          error ? 'border-crypto-red' : 'border-border-light'
        }`}
        {...rest}
      />
      {error && (
        <span className="text-xs text-crypto-red mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
