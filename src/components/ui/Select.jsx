import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Wybierz opcję',
  required = false,
  error,
  className = '',
  disabled = false,
  ...props 
}) => {
  const selectStyles = `
    w-full 
    h-11 px-3 py-2 /* Wyższy element */
    text-base md:text-sm /* Blokada zoomu na iOS */
    bg-white dark:bg-gray-800 
    border rounded-xl
    text-gray-900 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
    transition-all duration-200 cursor-pointer appearance-none
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-500 bg-red-50' 
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
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectStyles}
          {...props}
        >
          <option value="" disabled className="text-gray-400">{placeholder}</option>
          {options.map((option, index) => {
            const val = option.value || option.nazwa || option;
            const lbl = option.label || option.nazwa || option;
            return (
              <option key={index} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        {/* Własna strzałka dla lepszego wyglądu */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
};

export default Select;