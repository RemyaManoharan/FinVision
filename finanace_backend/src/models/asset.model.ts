import pool from "../config/db";

export interface Asset {
  asset_id: number;
  user_id: number;
  name: string;
  asset_type: string;
  current_value: number;
  acquisition_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AssetInput {
  name: string;
  asset_type: string;
  current_value: number;
  acquisition_date?: Date;
  notes?: string;
}

export interface AssetTypeData {
  asset_type: string;
  total_value: number;
}

export class AssetModel {
  // Create a new asset
  static async create(userId: number, assetData: AssetInput): Promise<Asset> {
    const query = `
      INSERT INTO assets 
      (user_id, name, asset_type, current_value, acquisition_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      userId,
      assetData.name,
      assetData.asset_type,
      assetData.current_value,
      assetData.acquisition_date || null,
      assetData.notes || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get asset by ID
  static async findById(
    assetId: number,
    userId: number
  ): Promise<Asset | null> {
    const query = `
      SELECT * FROM assets 
      WHERE asset_id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [assetId, userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  // Get all assets for a user
  static async findAllByUser(userId: number): Promise<Asset[]> {
    const query = `
      SELECT * FROM assets 
      WHERE user_id = $1
      ORDER BY current_value DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get assets grouped by type
  static async getAssetsByType(userId: number): Promise<AssetTypeData[]> {
    const query = `
      SELECT 
        asset_type,
        SUM(current_value) as total_value
      FROM assets
      WHERE user_id = $1
      GROUP BY asset_type
      ORDER BY total_value DESC
    `;

    const result = await pool.query(query, [userId]);

    return result.rows.map((row) => ({
      asset_type: row.asset_type,
      total_value: Number(row.total_value),
    }));
  }

  // Get total net worth
  static async getTotalNetWorth(userId: number): Promise<number> {
    const query = `
      SELECT SUM(current_value) as total
      FROM assets
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return Number(result.rows[0].total || 0);
  }

  // Update an asset
  static async update(
    assetId: number,
    userId: number,
    assetData: Partial<AssetInput>
  ): Promise<Asset> {
    // Start building the query
    let query = "UPDATE assets SET ";
    const values: any[] = [];
    const updates: string[] = [];
    let paramCount = 1;

    // Add each field that needs to be updated
    if (assetData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(assetData.name);
    }

    if (assetData.asset_type !== undefined) {
      updates.push(`asset_type = $${paramCount++}`);
      values.push(assetData.asset_type);
    }

    if (assetData.current_value !== undefined) {
      updates.push(`current_value = $${paramCount++}`);
      values.push(assetData.current_value);
    }

    if (assetData.acquisition_date !== undefined) {
      updates.push(`acquisition_date = $${paramCount++}`);
      values.push(assetData.acquisition_date);
    }

    if (assetData.notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(assetData.notes);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);

    // If no updates, return asset as is
    if (updates.length === 1) {
      // Only updated_at
      return this.findById(assetId, userId) as Promise<Asset>;
    }

    // Complete the query
    query += updates.join(", ");
    query += ` WHERE asset_id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    values.push(assetId, userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Asset not found or not owned by user");
    }

    return result.rows[0];
  }

  // Delete an asset
  static async delete(assetId: number, userId: number): Promise<boolean> {
    const query = `
      DELETE FROM assets 
      WHERE asset_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [assetId, userId]);

    return (result.rowCount ?? 0) > 0;
  }
}
