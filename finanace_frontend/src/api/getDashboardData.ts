import axios from "axios";
import { API_BASE_URL } from "../config";
import { DashboardData, BudgetData } from "../store/dashboardStore";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookie (react-auth-kit stores it there)
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_auth='));
    
    if (authCookie) {
      const token = authCookie.split('=')[1];
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Interface for API response
interface DashboardAPIResponse {
  success: boolean;
  data: DashboardData;
}

interface BudgetAPIResponse {
  success: boolean;
  data: BudgetData;
}

/**
 * Fetch dashboard data for a specific year and month
 */
export const getDashboardData = async (
  year: number,
  month: number
): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardAPIResponse>(
      `/api/dashboard/data?year=${year}&month=${month}`
    );

    if (!response.data.success) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch dashboard data. Please try again.'
    );
  }
};

/**
 * Fetch budget data for a specific year and month
 */
export const getBudgetData = async (
  year: number,
  month: number
): Promise<BudgetData> => {
  try {
    const response = await api.get<BudgetAPIResponse>(
      `/api/dashboard/budget?year=${year}&month=${month}`
    );

    if (!response.data.success) {
      throw new Error('Failed to fetch budget data');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching budget data:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch budget data. Please try again.'
    );
  }
};

/**
 * Fetch both dashboard and budget data simultaneously
 */
export const getAllDashboardData = async (
  year: number,
  month: number
): Promise<{ dashboardData: DashboardData; budgetData: BudgetData }> => {
  try {
    const [dashboardResponse, budgetResponse] = await Promise.all([
      getDashboardData(year, month),
      getBudgetData(year, month)
    ]);

    return {
      dashboardData: dashboardResponse,
      budgetData: budgetResponse
    };
  } catch (error) {
    console.error('Error fetching all dashboard data:', error);
    throw error;
  }
};

/**
 * Hook-like function to fetch data and update stores
 * This can be used in React components with useEffect
 */
export const fetchAndUpdateDashboardData = async (
  year: number,
  month: number,
  setDashboardData: (data: DashboardData) => void,
  setBudgetData: (data: BudgetData) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    const { dashboardData, budgetData } = await getAllDashboardData(year, month);
    
    setDashboardData(dashboardData);
    setBudgetData(budgetData);
  } catch (error: any) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// Export the configured axios instance for other API calls
export { api };