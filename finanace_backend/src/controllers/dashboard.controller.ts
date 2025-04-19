import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model";
import { AssetModel } from "../models/asset.model";
import { BudgetModel } from "../models/budget.model";

export class DashboardController {
  // Get all dashboard data for a specific month

  static async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get year and month from query params or use current month
      const currentDate = new Date();
      const year =
        parseInt(req.query.year as string) || currentDate.getFullYear();
      const month =
        parseInt(req.query.month as string) || currentDate.getMonth() + 1; // JS months are 0-based

      // Fetch all data in parallel for better performance
      const [
        monthlySummary,
        dailyExpenses,
        weeklyExpenses,
        monthlyIncomeExpense,
        expenseByCategory,
        incomeBySource,
        assetsByType,
        totalNetWorth,
        budgetProgress,
      ] = await Promise.all([
        TransactionModel.getMonthlySummary(userId, year, month),
        TransactionModel.getDailyExpenses(userId, year, month),
        TransactionModel.getWeeklyExpenses(userId, year, month),
        TransactionModel.getMonthlyIncomeExpense(userId, year, month),
        TransactionModel.getExpenseByCategory(userId, year, month),
        TransactionModel.getIncomeBySource(userId, year, month),
        AssetModel.getAssetsByType(userId),
        AssetModel.getTotalNetWorth(userId),
        BudgetModel.getOverallBudgetProgress(userId, year, month),
      ]);

      // Calculate monthly total expense
      const monthlyTotal = dailyExpenses.reduce(
        (sum, day) => sum + day.total,
        0
      );

      // Calculate weekly total expense
      const weeklyTotal = weeklyExpenses.reduce(
        (sum, week) => sum + week.total,
        0
      );

      // Return all data
      res.status(200).json({
        success: true,
        data: {
          summary: monthlySummary,
          expenses: {
            daily: dailyExpenses,
            weekly: weeklyExpenses,
            monthly: monthlyTotal,
            dailyTotal: dailyExpenses.reduce(
              (sum, item) => sum + item.total,
              0
            ),
            weeklyTotal: weeklyTotal,
          },
          charts: {
            incomeExpense: monthlyIncomeExpense,
            expenseByCategory: expenseByCategory,
            incomeBySource: incomeBySource,
          },
          assets: {
            byType: assetsByType,
            netWorth: totalNetWorth,
          },
          budget: {
            progress: budgetProgress,
          },
        },
      });
    } catch (error: any) {
      console.error("Dashboard data error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard data",
        error: error.message,
      });
    }
  }

  //    Get budget vs actual data for each category

  static async getBudgetVsActual(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get year and month from query params or use current month
      const currentDate = new Date();
      const year =
        parseInt(req.query.year as string) || currentDate.getFullYear();
      const month =
        parseInt(req.query.month as string) || currentDate.getMonth() + 1; // JS months are 0-based

      const budgetData = await BudgetModel.getBudgetVsActual(
        userId,
        year,
        month
      );

      res.status(200).json({
        success: true,
        data: budgetData,
      });
    } catch (error: any) {
      console.error("Budget vs actual error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching budget vs actual data",
        error: error.message,
      });
    }
  }
}
