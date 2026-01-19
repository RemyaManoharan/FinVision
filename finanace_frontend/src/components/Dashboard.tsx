import Sidebar from "./Sidebar";
import { useDashboardDataWithStore } from "../hooks/useDashboardData";
import { useFilterStore, getMonthName } from "../store/filterStore";
import {
  MdRefresh,
  MdError,
  MdTrendingUp,
  MdAccountBalance,
  MdShoppingCart,
  MdSavings,
} from "react-icons/md";
import StatCard from "./dashboard/StatCard";
import SpendingProgressBar from "./dashboard/SpendingProgressBar";
import DateFilter from "./dashboard/DateFilter";
import SpendByCategoryChart from "./charts/SpendByCategoryChart";

const Dashboard = () => {
  const { year, month } = useFilterStore();

  const { dashboardData, 
     isLoading, error, refetch } =
    useDashboardDataWithStore();

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
              <p className="text-[rgb(var(--color-muted))]">
                Loading dashboard data...
              </p>
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
              <button onClick={refetch} className="btn btn-primary">
                <MdRefresh className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper to calculate trend (mock data for now - you can calculate real trends later)
  const calculateTrend = (
    _current: number,
    type: "income" | "expense" | "balance"
  ) => {
    // Mock trend calculation - replace with real data later
    const mockTrends = {
      income: { value: 5.2, isPositive: true },
      expense: { value: 3.1, isPositive: false },
      balance: { value: 8.7, isPositive: true },
    };
    return mockTrends[type];
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
        <div className=" mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Financial Dashboard</h1>
              <p className="text-[rgb(var(--color-muted))]">
                {getMonthName(month)} {year} Overview
              </p>
            </div>
            <button
              onClick={refetch}
              className="btn btn-outline"
              disabled={isLoading}
            >
              <MdRefresh className="w-4 h-4 mr-2" />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
           <DateFilter />
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={dashboardData?.summary?.income || 0}
            icon={<MdTrendingUp />}
            trend={calculateTrend(
              dashboardData?.summary?.income || 0,
              "income"
            )}
            valueColor="text-green-500"
          />

          <StatCard
            title="Total Expenses"
            value={dashboardData?.summary?.expense || 0}
            icon={<MdShoppingCart />}
            trend={calculateTrend(
              dashboardData?.summary?.expense || 0,
              "expense"
            )}
            valueColor="text-red-500"
          />

          <StatCard
            title="Net Balance"
            value={dashboardData?.summary?.balance || 0}
            icon={<MdAccountBalance />}
            trend={calculateTrend(
              dashboardData?.summary?.balance || 0,
              "balance"
            )}
            valueColor={
              (dashboardData?.summary?.balance || 0) >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          />

          <StatCard
            title="Net Worth"
            value={dashboardData?.assets?.netWorth || 0}
            icon={<MdSavings />}
            valueColor="text-blue-500"
          />
        </div>
        {/* Spending Progress Bar */}
        <div className="mb-8">
          <SpendingProgressBar
            totalIncome={dashboardData?.summary?.income || 0}
            totalExpense={dashboardData?.summary?.expense || 0}
            currency="DKK"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
            <h2 className="text-xl font-semibold mb-4">
              Spending by Category
            </h2>
            <SpendByCategoryChart
              data={dashboardData?.charts?.expenseByCategory || []}
              currency="DKK"
              height={400}
            />
          </div>
          <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))] min-h-[300px] flex items-center justify-center">
            <p className="text-[rgb(var(--color-muted))]">
              More charts coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
