import { useQuery } from "@tanstack/react-query";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getDashboardData, getBudgetData } from "../api/getDashboardData";
import { useFilterStore } from "../store/filterStore";
import { useEffect } from "react";

interface UserResponse {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
  token: string;
}

export const useDashboardDataWithStore = () => {
  const auth = useAuthUser<UserResponse>();
  const authToken = auth?.token;
  const { year, month } = useFilterStore();

  // Debug logging
  useEffect(() => {
    console.log('🔧 useDashboardDataWithStore hook called');
    console.log('👤 Auth:', auth);
    console.log('🔑 Token:', authToken);
    console.log('📅 Year/Month:', year, month);
    console.log('✅ Enabled:', !!authToken);
  }, [auth, authToken, year, month]);

  const dashboardQuery = useQuery({
    queryKey: ['dashboardData', year, month],
    queryFn: async () => {
      console.log('🚀 Dashboard API call starting...');
      console.log('📍 Calling getDashboardData with:', { year, month, authToken: authToken?.substring(0, 20) + '...' });
      
      const result = await getDashboardData(year, month, authToken!);
      console.log('✅ Dashboard API call successful:', result);
      return result;
    },
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`🔄 Retry ${failureCount}:`, error);
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  const budgetQuery = useQuery({
    queryKey: ['budgetData', year, month],
    queryFn: async () => {
      console.log('🚀 Budget API call starting...');
      const result = await getBudgetData(year, month, authToken!);
      console.log('✅ Budget API call successful:', result);
      return result;
    },
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Debug query states
  useEffect(() => {
    console.log('📊 Query States:', {
      dashboard: {
        isLoading: dashboardQuery.isLoading,
        isSuccess: dashboardQuery.isSuccess,
        isError: dashboardQuery.isError,
        error: dashboardQuery.error,
        data: !!dashboardQuery.data
      },
      budget: {
        isLoading: budgetQuery.isLoading,
        isSuccess: budgetQuery.isSuccess,
        isError: budgetQuery.isError,
        error: budgetQuery.error,
        data: !!budgetQuery.data
      }
    });
  }, [
    dashboardQuery.isLoading, dashboardQuery.isSuccess, dashboardQuery.isError, dashboardQuery.error, dashboardQuery.data,
    budgetQuery.isLoading, budgetQuery.isSuccess, budgetQuery.isError, budgetQuery.error, budgetQuery.data
  ]);

  const refetch = () => {
    console.log('🔄 Manual refetch triggered');
    dashboardQuery.refetch();
    budgetQuery.refetch();
  };

  return {
    dashboardData: dashboardQuery.data,
    budgetData: budgetQuery.data,
    isLoading: dashboardQuery.isLoading || budgetQuery.isLoading,
    error: dashboardQuery.error?.message || budgetQuery.error?.message || null,
    refetch,
    isSuccess: dashboardQuery.isSuccess && budgetQuery.isSuccess,
    isError: dashboardQuery.isError || budgetQuery.isError,
    isAuthenticated: !!authToken,
  };
};