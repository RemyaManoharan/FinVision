import { create } from 'zustand';

// Get current year and month
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

interface FilterStore {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDate: (year: number, month: number) => void;
  resetToCurrentDate: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  year: currentYear,
  month: currentMonth,
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setDate: (year, month) => set({ year, month }),
  resetToCurrentDate: () => set({ year: currentYear, month: currentMonth }),
}));

// Helper functions to work with dates
export const getMonthName = (month: number): string => {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
};

export const getAllMonths = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
  }));
};

export const getYearRange = (startYear: number = currentYear - 2, endYear: number = currentYear + 1): { value: number; label: string }[] => {
  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => ({
      value: startYear + i,
      label: `${startYear + i}`,
    })
  );
};