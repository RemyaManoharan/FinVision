import { Request, Response } from 'express';
import { UserModel, UserInput } from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * User Controller
 * Contains all business logic related to user operations
 */
export class UserController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone_number }: UserInput = req.body;
      
      // Create the user
      const user = await UserModel.create({
        name,
        email,
        password,
        phone_number
      });
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
  
  /**
   * Login a user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Verify password
      const isPasswordValid = await UserModel.verifyPassword(user, password);
      
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  }
  
  /**
   * Get user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // req.user is set by the authenticateJWT middleware
      const userId = req.user!.userId;
      
      const user = await UserModel.findById(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  }
  
  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name, email, password, phone_number } = req.body;
      
      const updatedUser = await UserModel.update(userId, {
        name,
        email,
        password,
        phone_number
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  }
}