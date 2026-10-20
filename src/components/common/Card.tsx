import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-stone-200/90 shadow-2xs ${
        hoverEffect ? 'hover:shadow-lg hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer' : 'transition-colors duration-200'
      } ${className}`}
    >
      {children}
    </div>
  );
};
