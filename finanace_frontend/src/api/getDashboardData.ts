import axios from "axios";
import { API_BASE_URL } from "../config";
import { DashboardData, BudgetData } from "../store/dashboardStore";

interface DashboardAPIResponse {
  success: boolean;
  data: DashboardData;
}

interface BudgetAPIResponse {
  success: boolean;
  data: BudgetData;
}


export const getDashboardData = async (
  year: number,
  month: number,
  authToken: string
): Promise<DashboardData> => {
  const response = await axios.get<DashboardAPIResponse>(
    `${API_BASE_URL}/api/dashboard/data`,
    {
      params: { year, month },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.data.data;
};


export const getBudgetData = async (
  year: number,
  month: number,
  authToken: string
): Promise<BudgetData> => {
  const response = await axios.get<BudgetAPIResponse>(
    `${API_BASE_URL}/api/dashboard/budget`,
    {
      params: { year, month },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch budget data');
  }

  return response.data.data;
};

export const getAllDashboardData = async (
  year: number,
  month: number,
  authToken: string
): Promise<{ dashboardData: DashboardData; budgetData: BudgetData }> => {
  const [dashboardData, budgetData] = await Promise.all([
    getDashboardData(year, month, authToken),
    getBudgetData(year, month, authToken)
  ]);

  return { dashboardData, budgetData };
};