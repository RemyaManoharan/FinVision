import { useQuery, useQueries } from "@tanstack/react-query";
import { getDashboardData, getBudgetData, getAllDashboardData } from "../api/getDashboardData";
import { useDashboardStore } from "../store/dashboardStore";
import { useFilterStore } from "../store/filterStore";
import { useEffect } from "react";

/**
 * React Query hook for dashboard data
 */
export const useDashboardDataQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: ['dashboardData', year, month],
    queryFn: () => getDashboardData(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * React Query hook for budget data
 */
export const useBudgetDataQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: ['budgetData', year, month],
    queryFn: () => getBudgetData(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Combined hook that fetches both dashboard and budget data
 * and automatically updates the stores
 */
export const useDashboardDataWithStore = () => {
  const { year, month } = useFilterStore();
  const {
    setDashboardData,
    setBudgetData,
    setLoading,
    setError,
    dashboardData,
    budgetData,
    isLoading,
    error
  } = useDashboardStore();

  // Use parallel queries for better performance
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dashboardData', year, month],
        queryFn: () => getDashboardData(year, month),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['budgetData', year, month],
        queryFn: () => getBudgetData(year, month),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      }
    ]
  });

  const [dashboardQuery, budgetQuery] = queries;

  // Update stores when data changes
  useEffect(() => {
    const isAnyLoading = dashboardQuery.isLoading || budgetQuery.isLoading;
    const hasAnyError = dashboardQuery.error || budgetQuery.error;

    setLoading(isAnyLoading);

    if (hasAnyError) {
      const errorMessage = 
        (dashboardQuery.error as Error)?.message || 
        (budgetQuery.error as Error)?.message || 
        'Failed to fetch data';
      setError(errorMessage);
    } else {
      setError(null);
    }

    // Update dashboard data
    if (dashboardQuery.data && !dashboardQuery.error) {
      setDashboardData(dashboardQuery.data);
    }

    // Update budget data
    if (budgetQuery.data && !budgetQuery.error) {
      setBudgetData(budgetQuery.data);
    }
  }, [
    dashboardQuery.data,
    dashboardQuery.error,
    dashboardQuery.isLoading,
    budgetQuery.data,
    budgetQuery.error,
    budgetQuery.isLoading,
    setDashboardData,
    setBudgetData,
    setLoading,
    setError
  ]);

  // Refetch function for manual refresh
  const refetch = () => {
    dashboardQuery.refetch();
    budgetQuery.refetch();
  };

  return {
    dashboardData,
    budgetData,
    isLoading,
    error,
    refetch,
    isSuccess: dashboardQuery.isSuccess && budgetQuery.isSuccess,
    isError: dashboardQuery.isError || budgetQuery.isError,
  };
};

/**
 * Simple hook that just fetches data without store integration
 * Useful for components that don't need global state
 */
export const useSimpleDashboardData = (year: number, month: number) => {
  return useQuery({
    queryKey: ['allDashboardData', year, month],
    queryFn: () => getAllDashboardData(year, month),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};