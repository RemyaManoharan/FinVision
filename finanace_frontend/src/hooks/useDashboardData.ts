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

  const dashboardQuery = useQuery({
    queryKey: ["dashboardData", year, month],
    queryFn: () => getDashboardData(year, month, authToken!),
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const budgetQuery = useQuery({
    queryKey: ["budgetData", year, month],
    queryFn: () => getBudgetData(year, month, authToken!),
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const refetch = () => {
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
