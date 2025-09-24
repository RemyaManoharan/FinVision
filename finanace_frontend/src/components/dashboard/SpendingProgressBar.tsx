import React from 'react';
import { Progress } from 'antd';

interface SpendingProgressBarProps {
  totalIncome: number;
  totalExpense: number;
  currency?: string;
  className?: string;
}

const SpendingProgressBar: React.FC<SpendingProgressBarProps> = ({
  totalIncome,
  totalExpense,
  currency = 'DKK',
  className = ''
}) => {
  // Calculate percentage spent
  const spentPercentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  
  // Determine color based on spending level
  const getProgressColor = (percentage: number) => {
    if (percentage <= 50) return '#52c41a'; // Green - good spending
    if (percentage <= 75) return '#faad14'; // Orange - moderate spending
    return '#ff4d4f'; // Red - high spending
  };

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const remainingAmount = totalIncome - totalExpense;
  const isOverspent = totalExpense > totalIncome;

  return (
    <div className={`bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))] ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-2">
          Monthly Spending Progress
        </h3>
        <div className="flex justify-between items-center text-sm text-[rgb(var(--color-muted))] mb-3">
          <span>Spent: {formatCurrency(totalExpense)}</span>
          <span>Income: {formatCurrency(totalIncome)}</span>
        </div>
      </div>

      <Progress
        percent={Math.min(spentPercentage, 100)}
        strokeColor={getProgressColor(spentPercentage)}
        trailColor="rgb(var(--color-border))"
        strokeWidth={12}
        showInfo={false}
        className="mb-4"
      />

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-[rgb(var(--color-muted))]">Progress: </span>
          <span 
            className={`font-semibold ${
              spentPercentage <= 50 
                ? 'text-green-500' 
                : spentPercentage <= 75 
                ? 'text-yellow-500' 
                : 'text-red-500'
            }`}
          >
            {spentPercentage}%
          </span>
        </div>
        
        <div className="text-sm">
          <span className="text-[rgb(var(--color-muted))]">
            {isOverspent ? 'Overspent: ' : 'Remaining: '}
          </span>
          <span 
            className={`font-semibold ${
              isOverspent ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {formatCurrency(Math.abs(remainingAmount))}
          </span>
        </div>
      </div>

      {isOverspent && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          ⚠️ You've exceeded your monthly income by {formatCurrency(Math.abs(remainingAmount))}
        </div>
      )}
    </div>
  );
};

export default SpendingProgressBar;