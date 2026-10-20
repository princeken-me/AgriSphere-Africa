import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle
}) => {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-stone-400">{title}</p>
        <div className="p-1.5 bg-stone-50 rounded-lg text-emerald-700">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      {change && (
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
      )}
      {subtitle && <p className="text-xs font-medium text-stone-500 mt-1">{subtitle}</p>}
    </div>
  );
};
