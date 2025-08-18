import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  valueColor = 'text-[rgb(var(--color-foreground))]'
}) => {
  // Format currency if needed
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="stat-label">{title}</span>
        {icon && <span className="text-lg text-[rgb(var(--color-muted))]">{icon}</span>}
      </div>
      
      <div className="flex flex-col">
        <span className={`stat-value ${valueColor}`}>{formattedValue}</span>
        
        {trend && (
          <div className="flex items-center mt-2">
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-xs text-[rgb(var(--color-muted))]">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;