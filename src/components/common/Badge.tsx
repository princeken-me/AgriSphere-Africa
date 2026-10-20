import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'blue' | 'rose' | 'stone' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'emerald', size = 'sm', icon }) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    stone: 'bg-stone-100 text-stone-700 border-stone-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5 font-medium'
  };

  return (
    <span className={`inline-flex items-center rounded-full border border-solid font-medium tracking-wide whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
