import pool from "../config/db";

export interface Transaction {
  transaction_id: number;
  user_id: number;
  amount: number;
  transaction_date: Date;
  description: string;
  transaction_type: 'income' | 'expense';
  category_id: number;
  is_recurring: boolean;
  created_at: Date;
}

export interface TransactionInput {
  amount: number;
  transaction_date: Date;
  description?: string;
  transaction_type: 'income' | 'expense';
  category_id: number;
  is_recurring?: boolean;
}

export interface MonthlyExpenseData {
  date: string;
  total: number;
}

export interface CategoryExpenseData {
  category_name: string;
  total: number;
}

export interface IncomeSourceData {
  category_name: string;
  total: number;
}

export interface SummaryData {
  income: number;
  expense: number;
  balance: number;
}

export class TransactionModel {
  // Create a new transaction
  static async create(userId: number, transactionData: TransactionInput): Promise<Transaction> {
    const query = `
      INSERT INTO transactions 
      (user_id, amount, transaction_date, description, transaction_type, category_id, is_recurring)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      userId,
      transactionData.amount,
      transactionData.transaction_date,
      transactionData.description || null,
      transactionData.transaction_type,
      transactionData.category_id,
      transactionData.is_recurring || false
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get transaction by ID
  static async findById(transactionId: number, userId: number): Promise<Transaction | null> {
    const query = `
      SELECT * FROM transactions 
      WHERE transaction_id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [transactionId, userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  // Get all transactions for a user
  static async findAllByUser(userId: number, limit: number = 100, offset: number = 0): Promise<Transaction[]> {
    const query = `
      SELECT * FROM transactions 
      WHERE user_id = $1
      ORDER BY transaction_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // Get monthly summary (income, expense, balance) for specific month
  static async getMonthlySummary(userId: number, year: number, month: number): Promise<SummaryData> {
    const query = `
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        AND EXTRACT(MONTH FROM transaction_date) = $3
    `;

    const result = await pool.query(query, [userId, year, month]);
    const summary = result.rows[0];
    
    return {
      income: Number(summary.income || 0),
      expense: Number(summary.expense || 0),
      balance: Number(summary.income || 0) - Number(summary.expense || 0)
    };
  }

  // Get daily expenses for current month
  static async getDailyExpenses(userId: number, year: number, month: number): Promise<MonthlyExpenseData[]> {
    const query = `
      SELECT 
        EXTRACT(DAY FROM transaction_date)::integer as day,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND transaction_type = 'expense'
        AND EXTRACT(YEAR FROM transaction_date) = $2
        AND EXTRACT(MONTH FROM transaction_date) = $3
      GROUP BY day
      ORDER BY day
    `;

    const result = await pool.query(query, [userId, year, month]);
    
    return result.rows.map(row => ({
      date: String(row.day),
      total: Number(row.total)
    }));
  }

  // Get weekly expenses for current month
  static async getWeeklyExpenses(userId: number, year: number, month: number): Promise<MonthlyExpenseData[]> {
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('week', transaction_date), 'YYYY-MM-DD') as week_start,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND transaction_type = 'expense'
        AND EXTRACT(YEAR FROM transaction_date) = $2
        AND EXTRACT(MONTH FROM transaction_date) = $3
      GROUP BY week_start
      ORDER BY week_start
    `;

    const result = await pool.query(query, [userId, year, month]);
    
    return result.rows.map(row => ({
      date: row.week_start,
      total: Number(row.total)
    }));
  }

  // Get monthly income and expense for chart
  static async getMonthlyIncomeExpense(userId: number, year: number, month: number): Promise<any[]> {
    const query = `
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM-DD') as date,
        transaction_type,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        AND EXTRACT(MONTH FROM transaction_date) = $3
      GROUP BY date, transaction_type
      ORDER BY date
    `;

    const result = await pool.query(query, [userId, year, month]);
    
    // Process the result to format it for the chart
    const chartData: Record<string, any> = {};
    
    result.rows.forEach(row => {
      if (!chartData[row.date]) {
        chartData[row.date] = { date: row.date, income: 0, expense: 0 };
      }
      
      if (row.transaction_type === 'income') {
        chartData[row.date].income = Number(row.total);
      } else {
        chartData[row.date].expense = Number(row.total);
      }
    });
    
    return Object.values(chartData);
  }

  // Get expense by category for current month
  static async getExpenseByCategory(userId: number, year: number, month: number): Promise<CategoryExpenseData[]> {
    const query = `
      SELECT 
        ec.name as category_name,
        SUM(t.amount) as total
      FROM transactions t
      JOIN expense_categories ec ON t.category_id = ec.expense_category_id
      WHERE t.user_id = $1 
        AND t.transaction_type = 'expense'
        AND EXTRACT(YEAR FROM t.transaction_date) = $2
        AND EXTRACT(MONTH FROM t.transaction_date) = $3
      GROUP BY ec.name
      ORDER BY total DESC
    `;

    const result = await pool.query(query, [userId, year, month]);
    
    return result.rows.map(row => ({
      category_name: row.category_name,
      total: Number(row.total)
    }));
  }

  // Get income by source for current month
  static async getIncomeBySource(userId: number, year: number, month: number): Promise<IncomeSourceData[]> {
    const query = `
      SELECT 
        ic.name as category_name,
        SUM(t.amount) as total
      FROM transactions t
      JOIN income_categories ic ON t.category_id = ic.income_category_id
      WHERE t.user_id = $1 
        AND t.transaction_type = 'income'
        AND EXTRACT(YEAR FROM t.transaction_date) = $2
        AND EXTRACT(MONTH FROM t.transaction_date) = $3
      GROUP BY ic.name
      ORDER BY total DESC
    `;

    const result = await pool.query(query, [userId, year, month]);
    
    return result.rows.map(row => ({
      category_name: row.category_name,
      total: Number(row.total)
    }));
  }

  // Get budget progress for current month
  static async getBudgetProgress(userId: number, year: number, month: number): Promise<{total_spent: number, total_budget: number, progress: number}> {
    const query = `
      SELECT 
        SUM(t.amount) as total_spent,
        SUM(b.amount) as total_budget
      FROM transactions t
      JOIN budgets b ON t.user_id = b.user_id AND t.category_id = b.expense_category_id
      WHERE t.user_id = $1 
        AND t.transaction_type = 'expense'
        AND EXTRACT(YEAR FROM t.transaction_date) = $2
        AND EXTRACT(MONTH FROM t.transaction_date) = $3
        AND b.period = 'monthly'
        AND (
          (b.start_date <= DATE_TRUNC('month', TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD'))::date AND 
           (b.end_date IS NULL OR b.end_date >= DATE_TRUNC('month', TO_DATE($2 || '-' || $3 || '-01', 'YYYY-MM-DD'))::date + INTERVAL '1 month' - INTERVAL '1 day'))
    `;

    const result = await pool.query(query, [userId, year, month]);
    const data = result.rows[0];
    
    const totalSpent = Number(data.total_spent || 0);
    const totalBudget = Number(data.total_budget || 0);
    const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      total_spent: totalSpent,
      total_budget: totalBudget,
      progress: Math.min(progress, 100) // Cap at 100%
    };
  }

  // Update a transaction
  static async update(transactionId: number, userId: number, transactionData: Partial<TransactionInput>): Promise<Transaction> {
    // Start building the query
    let query = "UPDATE transactions SET ";
    const values: any[] = [];
    const updates: string[] = [];
    let paramCount = 1;

    // Add each field that needs to be updated
    if (transactionData.amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(transactionData.amount);
    }

    if (transactionData.transaction_date !== undefined) {
      updates.push(`transaction_date = $${paramCount++}`);
      values.push(transactionData.transaction_date);
    }

    if (transactionData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(transactionData.description);
    }

    if (transactionData.transaction_type !== undefined) {
      updates.push(`transaction_type = $${paramCount++}`);
      values.push(transactionData.transaction_type);
    }

    if (transactionData.category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(transactionData.category_id);
    }

    if (transactionData.is_recurring !== undefined) {
      updates.push(`is_recurring = $${paramCount++}`);
      values.push(transactionData.is_recurring);
    }

    // If no updates, return transaction as is
    if (updates.length === 0) {
      return this.findById(transactionId, userId) as Promise<Transaction>;
    }

    // Complete the query
    query += updates.join(", ");
    query += ` WHERE transaction_id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    values.push(transactionId, userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Transaction not found or not owned by user");
    }

    return result.rows[0];
  }

  // Delete a transaction
  static async delete(transactionId: number, userId: number): Promise<boolean> {
    const query = `
      DELETE FROM transactions 
      WHERE transaction_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [transactionId, userId]);
    
    return (result.rowCount ?? 0) > 0;
  }
}