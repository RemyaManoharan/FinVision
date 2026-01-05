import React from 'react';
import { useFilterStore, getMonthName } from '../../store/filterStore';

interface MonthOption {
  year: number;
  month: number;
  label: string;
  value: string;
  isCurrent: boolean;  // To mark current month
}

const DateFilter: React.FC = () => {
  const { year, month, setDate } = useFilterStore();
  
  /**
   * Generate month options: Current month + Previous 3 months
   * Example: If today is Jan 5, 2026:
   * - January 2026 (current - partial data)
   * - December 2025 (previous - complete data) <- DEFAULT
   * - November 2025 (2 months ago - complete)
   * - October 2025 (3 months ago - complete)
   */
  const getMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
    const today = new Date();
    
    // Generate 4 months: current month (i=0) + previous 3 months (i=1,2,3)
    for (let i = 0; i < 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const optionYear = date.getFullYear();
      const optionMonth = date.getMonth() + 1; // JavaScript months are 0-based
      
      options.push({
        year: optionYear,
        month: optionMonth,
        label: `${getMonthName(optionMonth)} ${optionYear}`,
        value: `${optionYear}-${optionMonth}`,
        isCurrent: i === 0  // First iteration is current month
      });
    }
    
    return options;
  };

  const monthOptions = getMonthOptions();
  const currentValue = `${year}-${month}`;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [selectedYear, selectedMonth] = e.target.value.split('-').map(Number);
    setDate(selectedYear, selectedMonth);
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-[rgb(var(--color-foreground))]">
        Select Period:
      </label>
      <select
        className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md px-4 py-2 text-sm text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-hover))] transition-colors cursor-pointer"
        value={currentValue}
        onChange={handleMonthChange}
      >
        {monthOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-[rgb(var(--color-card))] text-[rgb(var(--color-foreground))]"
          >
            {option.label}{option.isCurrent ? ' (Current)' : ''}
          </option>
        ))}
      </select>
      
      {/* Optional: Info text to show which month has complete data */}
      <span className="text-xs text-[rgb(var(--color-muted))] italic">
        {monthOptions.find(opt => opt.value === currentValue)?.isCurrent 
          ? 'Partial month data' 
          : 'Complete month data'}
      </span>
    </div>
  );
};

export default DateFilter;