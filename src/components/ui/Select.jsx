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
  ...props 
}) => {
  const selectStyles = `
    w-full h-11 px-3 py-2 border rounded-xl 
    text-base md:text-sm /* 16px na mobile zapobiega zoomowi */
    bg-white text-gray-900
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
    transition-all duration-200 cursor-pointer appearance-none
    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
  `;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 ml-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={selectStyles}
          {...props}
        >
          <option value="" disabled className="text-gray-400">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option.nazwa || option}>
              {option.label || option.nazwa || option}
            </option>
          ))}
        </select>
        
        {/* Ikona strzałki dla lepszego wyglądu */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-600 text-xs mt-1 font-medium ml-1">{error}</p>}
    </div>
  );
};

export default Select;