import { create } from "zustand";

export interface SummaryData {
  income: number;
  expense: number;
  balance: number;
}
export interface ExpenseData {
  date: string;
  total: number;
}

export interface CategoryData {
  category_name: string;
  total: number;
}

export interface AssetTypeData {
  asset_type: string;
  total_value: number;
}

export interface BudgetProgressData {
  budget_amount: number;
  spent_amount: number;
  percentage: number;
}

export interface BudgetCategoryData {
  category_name: string;
  budget_amount: number;
  spent_amount: number;
  remaining: number;
  percentage: number;
}
export interface DashboardData {
  summary: SummaryData;
  expenses: {
    daily: ExpenseData[];
    weekly: ExpenseData[];
    monthly: number;
    dailyTotal: number;
    weeklyTotal: number;
  };
  charts: {
    incomeExpense: { date: string; income: number; expense: number }[];
    expenseByCategory: CategoryData[];
    incomeBySource: CategoryData[];
  };
  assets: {
    byType: AssetTypeData[];
    netWorth: number;
  };
  budget: {
    progress: BudgetProgressData;
  };
}

export interface BudgetData extends Array<BudgetCategoryData> {}

interface DashboardStore {
  dashboardData: DashboardData | null;
  budgetData: BudgetData | null;
  isLoading: boolean;
  error: string | null;
  setDashboardData: (data: DashboardData) => void;
  setBudgetData: (data: BudgetData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

const initialDashboardData: DashboardData = {
  summary: { income: 0, expense: 0, balance: 0 },
  expenses: {
    daily: [],
    weekly: [],
    monthly: 0,
    dailyTotal: 0,
    weeklyTotal: 0,
  },
  charts: {
    incomeExpense: [],
    expenseByCategory: [],
    incomeBySource: [],
  },
  assets: {
    byType: [],
    netWorth: 0,
  },
  budget: {
    progress: {
      budget_amount: 0,
      spent_amount: 0,
      percentage: 0,
    },
  },
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: null,
  budgetData: null,
  isLoading: false,
  error: null,
  setDashboardData: (data) => set({ dashboardData: data }),
  setBudgetData: (data) => set({ budgetData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearData: () =>
    set({
      dashboardData: null,
      budgetData: null,
      error: null,
    }),
}));
