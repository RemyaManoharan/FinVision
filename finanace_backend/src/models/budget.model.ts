import pool from "../config/db";

export interface Budget {
  budget_id: number;
  user_id: number;
  expense_category_id: number;
  amount: number;
  period: "monthly" | "yearly";
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetInput {
  expense_category_id: number;
  amount: number;
  period: "monthly" | "yearly";
  start_date: Date;
  end_date?: Date;
}

export interface BudgetCategoryData {
  category_name: string;
  budget_amount: number;
  spent_amount: number;
  remaining: number;
  percentage: number;
}

export class BudgetModel {
  // Create a new budget
  static async create(
    userId: number,
    budgetData: BudgetInput
  ): Promise<Budget> {
    const query = `
      INSERT INTO budgets 
      (user_id, expense_category_id, amount, period, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      userId,
      budgetData.expense_category_id,
      budgetData.amount,
      budgetData.period,
      budgetData.start_date,
      budgetData.end_date || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get budget by ID
  static async findById(
    budgetId: number,
    userId: number
  ): Promise<Budget | null> {
    const query = `
      SELECT * FROM budgets 
      WHERE budget_id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [budgetId, userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  // Get all budgets for a user
  static async findAllByUser(userId: number): Promise<Budget[]> {
    const query = `
      SELECT * FROM budgets 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get all active budgets for a given month
  static async findActiveByMonth(
    userId: number,
    year: number,
    month: number
  ): Promise<Budget[]> {
    const query = `
      SELECT * FROM budgets 
      WHERE user_id = $1
        AND start_date <= DATE_TRUNC('month', TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD'))::date + INTERVAL '1 month' - INTERVAL '1 day'
        AND (end_date IS NULL OR end_date >= TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD')::date)
      ORDER BY amount DESC
    `;

    const result = await pool.query(query, [userId, year, month]);
    return result.rows;
  }

  // Get budget vs actual spending by category for a given month
  static async getBudgetVsActual(
    userId: number,
    year: number,
    month: number
  ): Promise<BudgetCategoryData[]> {
    const query = `
      SELECT 
        ec.name as category_name,
        b.amount as budget_amount,
        COALESCE(SUM(t.amount), 0) as spent_amount
      FROM budgets b
      JOIN expense_categories ec ON b.expense_category_id = ec.expense_category_id
      LEFT JOIN transactions t ON 
        t.user_id = b.user_id AND 
        t.category_id = b.expense_category_id AND
        t.transaction_type = 'expense' AND
        EXTRACT(YEAR FROM t.transaction_date) = $2 AND
        EXTRACT(MONTH FROM t.transaction_date) = $3
      WHERE b.user_id = $1
        AND b.period = 'monthly'
        AND b.start_date <= DATE_TRUNC('month', TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD'))::date + INTERVAL '1 month' - INTERVAL '1 day'
        AND (b.end_date IS NULL OR b.end_date >= TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD')::date)
      GROUP BY ec.name, b.amount
      ORDER BY spent_amount DESC
    `;

    const result = await pool.query(query, [userId, year, month]);

    return result.rows.map((row) => {
      const budgetAmount = Number(row.budget_amount);
      const spentAmount = Number(row.spent_amount);
      const remaining = budgetAmount - spentAmount;
      const percentage =
        budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

      return {
        category_name: row.category_name,
        budget_amount: budgetAmount,
        spent_amount: spentAmount,
        remaining: remaining,
        percentage: Math.min(percentage, 100), // Cap at 100%
      };
    });
  }

  // Get overall budget progress for a given month
  static async getOverallBudgetProgress(
    userId: number,
    year: number,
    month: number
  ): Promise<{
    budget_amount: number;
    spent_amount: number;
    percentage: number;
  }> {
    const query = `
      SELECT 
        SUM(b.amount) as budget_amount,
        COALESCE(SUM(t.amount), 0) as spent_amount
      FROM budgets b
      LEFT JOIN transactions t ON 
        t.user_id = b.user_id AND 
        t.category_id = b.expense_category_id AND
        t.transaction_type = 'expense' AND
        EXTRACT(YEAR FROM t.transaction_date) = $2 AND
        EXTRACT(MONTH FROM t.transaction_date) = $3
      WHERE b.user_id = $1
        AND b.period = 'monthly'
        AND b.start_date <= DATE_TRUNC('month', TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD'))::date + INTERVAL '1 month' - INTERVAL '1 day'
        AND (b.end_date IS NULL OR b.end_date >= TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD')::date)
    `;

    const result = await pool.query(query, [userId, year, month]);
    const data = result.rows[0];

    const budgetAmount = Number(data.budget_amount || 0);
    const spentAmount = Number(data.spent_amount || 0);
    const percentage =
      budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

    return {
      budget_amount: budgetAmount,
      spent_amount: spentAmount,
      percentage: Math.min(percentage, 100), // Cap at 100%
    };
  }

  // Update a budget
  static async update(
    budgetId: number,
    userId: number,
    budgetData: Partial<BudgetInput>
  ): Promise<Budget> {
    // Start building the query
    let query = "UPDATE budgets SET ";
    const values: any[] = [];
    const updates: string[] = [];
    let paramCount = 1;

    // Add each field that needs to be updated
    if (budgetData.expense_category_id !== undefined) {
      updates.push(`expense_category_id = $${paramCount++}`);
      values.push(budgetData.expense_category_id);
    }

    if (budgetData.amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(budgetData.amount);
    }

    if (budgetData.period !== undefined) {
      updates.push(`period = $${paramCount++}`);
      values.push(budgetData.period);
    }

    if (budgetData.start_date !== undefined) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(budgetData.start_date);
    }

    if (budgetData.end_date !== undefined) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(budgetData.end_date);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);

    // If no updates, return budget as is
    if (updates.length === 1) {
      // Only updated_at
      return this.findById(budgetId, userId) as Promise<Budget>;
    }

    // Complete the query
    query += updates.join(", ");
    query += ` WHERE budget_id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    values.push(budgetId, userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Budget not found or not owned by user");
    }

    return result.rows[0];
  }

  // Delete a budget
  static async delete(budgetId: number, userId: number): Promise<boolean> {
    const query = `
      DELETE FROM budgets 
      WHERE budget_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [budgetId, userId]);

    return (result.rowCount ?? 0) > 0;
  }
}
