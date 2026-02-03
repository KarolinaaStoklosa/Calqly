import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = '',
  disabled = false,
  ...props 
}) => {
  const inputStyles = `
    w-full 
    h-11 px-3 py-2  /* Wyższy input dla łatwiejszego trafienia palcem */
    text-base md:text-sm /* 16px na mobile (stop zoom), 14px na desktop */
    bg-white dark:bg-gray-800 
    border rounded-xl /* Nowocześniejsze zaokrąglenie */
    text-gray-900 dark:text-gray-100
    placeholder-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500' 
      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
    }
  `;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputStyles}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1 ml-1 font-medium animate-in slide-in-from-left-1">
          {error.message || error}
        </p>
      )}
    </div>
  );
};

export default Input;