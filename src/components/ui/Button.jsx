import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Dodano active:scale-[0.98] dla efektu kliknięcia na mobile
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variants = {
    // Użycie Twojego koloru brandowego
    primary: 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-md shadow-brand-500/20 hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md',
    danger: 'bg-white border border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-500',
    outline: 'bg-white border-2 border-brand-500 text-brand-500 hover:bg-brand-50 focus:ring-brand-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs h-8',
    md: 'px-4 py-2.5 text-sm h-11', // Wysokość 44px - standard mobile
    lg: 'px-6 py-3 text-base h-12'
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;