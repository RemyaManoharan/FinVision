import Sidebar from "./Sidebar";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useDashboardDataWithStore } from "../api/useDashboardData";
import { useFilterStore, getMonthName } from "../store/filterStore";
import { useDashboardStore } from "../store/dashboardStore";
import { MdRefresh, MdError, MdTrendingUp, MdTrendingDown, MdAccountBalance } from "react-icons/md";


const Dashboard = () => {
  const auth = useAuthUser();
   // pass the token from auth to the axios instance
   // use tanstack query to fetch the data from the api
   const { year, month } = useFilterStore();
  const { 
    dashboardData, 
    budgetData, 
    isLoading, 
    error, 
    refetch 
  } = useDashboardDataWithStore();
   // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
              <p className="text-[rgb(var(--color-muted))]">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen">
        <div className="w-64 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MdError className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
              <p className="text-[rgb(var(--color-muted))] mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="btn btn-primary"
              >
                <MdRefresh className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex h-screen">
    
      <div className="w-64 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        {/* Sidebar content will go here */}
        <Sidebar />
      </div>

      {/* Main content - right column */}
      <div className="flex-1 overflow-auto p-6">
        {/* Dashboard content will go here */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-[rgb(var(--color-muted))]">
              {getMonthName(month)} {year} Overview
            </p>
          </div>
          <button 
            onClick={refetch}
            className="btn btn-outline"
            disabled={isLoading}
          >
            <MdRefresh className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        {dashboardData && (
          <div className="dashboard-grid mb-8">
            {/* Income Card */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Monthly Income</span>
                <MdTrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="stat-value text-green-500">
                {formatCurrency(dashboardData.summary.income)}
              </div>
            </div>

            {/* Expense Card */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Monthly Expenses</span>
                <MdTrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div className="stat-value text-red-500">
                {formatCurrency(dashboardData.summary.expense)}
              </div>
            </div>

            {/* Balance Card */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Net Balance</span>
                <MdAccountBalance className="w-5 h-5 text-blue-500" />
              </div>
              <div className={`stat-value ${
                dashboardData.summary.balance >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(dashboardData.summary.balance)}
              </div>
            </div>

            {/* Net Worth Card */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Net Worth</span>
                <MdAccountBalance className="w-5 h-5 text-purple-500" />
              </div>
              <div className="stat-value text-purple-500">
                {formatCurrency(dashboardData.assets.netWorth)}
              </div>
            </div>
          </div>
        )}

        {/* Budget Progress */}
        {budgetData && budgetData.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-medium mb-4">Budget Overview</h3>
            <div className="space-y-4">
              {budgetData.map((budget, index) => (
                <div key={index} className="border-b border-[rgb(var(--color-border))] pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{budget.category_name}</span>
                    <div className="text-sm">
                      <span className={budget.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatCurrency(budget.spent_amount)}
                      </span>
                      <span className="text-[rgb(var(--color-muted))]"> / {formatCurrency(budget.budget_amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[rgb(var(--color-card-hover))] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        budget.percentage > 100 ? 'bg-red-500' : 
                        budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-[rgb(var(--color-muted))]">
                    <span>{budget.percentage.toFixed(1)}% used</span>
                    <span>{budget.remaining >= 0 ? 'Remaining' : 'Over budget'}: {formatCurrency(Math.abs(budget.remaining))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Categories */}
        {dashboardData && dashboardData.charts.expenseByCategory.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-medium mb-4">Expenses by Category</h3>
            <div className="space-y-3">
              {dashboardData.charts.expenseByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{category.category_name}</span>
                  <span className="font-medium">{formatCurrency(category.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Sources */}
        {dashboardData && dashboardData.charts.incomeBySource.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-medium mb-4">Income by Source</h3>
            <div className="space-y-3">
              {dashboardData.charts.incomeBySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{source.category_name}</span>
                  <span className="font-medium text-green-500">{formatCurrency(source.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assets by Type */}
        {dashboardData && dashboardData.assets.byType.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-medium mb-4">Assets by Type</h3>
            <div className="space-y-3">
              {dashboardData.assets.byType.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{asset.asset_type}</span>
                  <span className="font-medium text-purple-500">{formatCurrency(asset.total_value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div> 
      </div>
  
  );
};

export default Dashboard;
