import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center 
    font-semibold rounded-xl 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-1 
    active:scale-[0.98] /* Efekt wciśnięcia na telefonie */
    disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
  `;
  
  const variants = {
    // Twoja nowa marka (Pomarańczowy)
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 focus:ring-brand-500',
    
    // Outline (Dla przycisków drugiego rzędu)
    outline: 'bg-white border-2 border-brand-100 text-brand-600 hover:border-brand-200 hover:bg-brand-50 focus:ring-brand-500',
    
    // Secondary (Szary, np. Anuluj)
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    
    // Akcje destrukcyjne (Usuń)
    danger: 'bg-white border border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-500',
    
    // Ghost (Tylko ikona lub tekst)
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs h-8',
    md: 'px-4 py-2.5 text-sm h-11', /* Standard mobilny ~44px */
    lg: 'px-6 py-3.5 text-base h-12',
    icon: 'p-2.5 h-10 w-10' /* Dla samych ikon */
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;