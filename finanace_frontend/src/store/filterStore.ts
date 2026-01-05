import { create } from 'zustand';

// Get today's date
const today = new Date();

// Current year and month (TODAY - January 5, 2026)
const currentYear = today.getFullYear();  // 2026
const currentMonth = today.getMonth() + 1;  // 1 (January) - JS months are 0-based

// Default to PREVIOUS month (because it has complete data)
// If today is Jan 5, 2026 -> default to December 2025
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const defaultYear = previousMonthDate.getFullYear();  // 2025
const defaultMonth = previousMonthDate.getMonth() + 1;  // 12 (December)

interface FilterStore {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDate: (year: number, month: number) => void;
  resetToPreviousMonth: () => void;
  resetToCurrentMonth: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Initialize with PREVIOUS month (complete data)
  year: defaultYear,
  month: defaultMonth,
  
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setDate: (year, month) => set({ year, month }),
  
  // Reset to previous complete month (default view)
  resetToPreviousMonth: () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    set({ 
      year: prevMonth.getFullYear(), 
      month: prevMonth.getMonth() + 1 
    });
  },
  
  // Reset to current month (if user wants to see current month's partial data)
  resetToCurrentMonth: () => {
    const now = new Date();
    set({ 
      year: now.getFullYear(), 
      month: now.getMonth() + 1 
    });
  },
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

// Export current date info for use in components
export const getCurrentDate = () => ({
  currentYear,
  currentMonth,
  defaultYear,
  defaultMonth,
});