import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '', 
  id,
  ...rest 
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-text">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`px-3 py-2 bg-white border rounded-input text-ink focus:border-black outline-none transition-all duration-200 appearance-none ${
          error ? 'border-crypto-red' : 'border-border-light'
        }`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-crypto-red mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
