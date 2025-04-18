import pool from "../config/db";
import bcrypt from "bcrypt";

export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  created_at: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export class UserModel {
  static async create(userData: UserInput): Promise<User> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const query = `
      INSERT INTO users (name, email, password, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      userData.name,
      userData.email,
      hashedPassword,
      userData.phone_number || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505") {
        throw new Error("User with this email already exists");
      }
      throw error;
    }
  }

  // Find a user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  // Find a user by ID
  static async findById(userId: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE user_id = $1";

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  // Update user details
  static async update(
    userId: number,
    userData: Partial<UserInput>
  ): Promise<User> {
    // Start building the query
    let query = "UPDATE users SET ";
    const values: any[] = [];
    const updates: string[] = [];
    let paramCount = 1;

    // Add each field that needs to be updated
    if (userData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }

    if (userData.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      updates.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }

    if (userData.phone_number !== undefined) {
      updates.push(`phone_number = $${paramCount++}`);
      values.push(userData.phone_number);
    }

    // If no updates, return user as is
    if (updates.length === 0) {
      return this.findById(userId) as Promise<User>;
    }

    // Complete the query
    query += updates.join(", ");
    query += ` WHERE user_id = $${paramCount} RETURNING *`;
    values.push(userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }

  //Verify a user's password

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
