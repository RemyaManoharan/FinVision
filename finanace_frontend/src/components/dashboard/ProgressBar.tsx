import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  height?: string;
  color?: string;
  bgColor?: string;
  showPercentage?: boolean;
  className?: string;
  dangerThreshold?: number;
  warningThreshold?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  height = 'h-2',
  color = 'bg-[rgb(var(--color-primary))]',
  bgColor = 'bg-[rgb(var(--color-card-hover))]',
  showPercentage = false,
  className = '',
  dangerThreshold = 100,
  warningThreshold = 80,
}) => {
  // Calculate if we should show warning or danger colors
  const progressColor = percentage >= dangerThreshold
    ? 'bg-red-500'
    : percentage >= warningThreshold
      ? 'bg-yellow-500'
      : color;

  // Cap percentage at 100
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-[rgb(var(--color-muted))]">{label}</span>
          {showPercentage && (
            <span className="text-sm text-[rgb(var(--color-muted))]">{Math.round(clampedPercentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${height} ${bgColor} rounded-full overflow-hidden`}>
        <div
          className={`${height} ${progressColor} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;