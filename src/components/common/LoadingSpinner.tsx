import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading AgriSphere data...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative flex items-center justify-center">
        <div className={`${sizeMap[size]} border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin`} />
        <Sprout className="w-5 h-5 text-emerald-700 absolute animate-pulse" />
      </div>
      {label && <p className="text-xs font-medium text-stone-500 animate-pulse">{label}</p>}
    </div>
  );
};
