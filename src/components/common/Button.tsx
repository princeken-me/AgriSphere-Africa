import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none';
  
  const variants = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow-md hover:shadow-emerald-900/20 focus:ring-emerald-600',
    secondary: 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md focus:ring-stone-700',
    outline: 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-2xs focus:ring-stone-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    ghost: 'text-stone-700 hover:bg-stone-100/80 focus:ring-stone-400'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
