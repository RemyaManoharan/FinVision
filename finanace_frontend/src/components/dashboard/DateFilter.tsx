import React from 'react';
import { useFilterStore, getAllMonths, getYearRange } from '../../store/filterStore';

const DateFilter: React.FC = () => {
  const { year, month, setYear, setMonth } = useFilterStore();
  
  const months = getAllMonths();
  const years = getYearRange();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex flex-col">
        <label className="text-sm text-[rgb(var(--color-muted))] mb-1">Year</label>
        <select
          className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md p-2 text-sm"
          value={year}
          onChange={handleYearChange}
        >
          {years.map((yearOption) => (
            <option key={yearOption.value} value={yearOption.value}>
              {yearOption.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-[rgb(var(--color-muted))] mb-1">Month</label>
        <select
          className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md p-2 text-sm"
          value={month}
          onChange={handleMonthChange}
        >
          {months.map((monthOption) => (
            <option key={monthOption.value} value={monthOption.value}>
              {monthOption.label}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="mt-6 px-3 py-2 text-sm bg-[rgb(var(--color-card-hover))] rounded-md hover:bg-[rgb(var(--color-border))] transition-colors"
        onClick={() => useFilterStore.getState().resetToCurrentDate()}
      >
        Reset
      </button>
    </div>
  );
};

export default DateFilter;