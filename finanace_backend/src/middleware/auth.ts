import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  userId: number;
  email: string;
}

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

//  Authentication middleware to verify JWT tokens
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No authentication token provided" });
    return;
  }

  // Extract the token (remove "Bearer " prefix if present)
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as TokenPayload;

    // Add user info to the request object
    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};

// Optional authentication middleware that continues even if token is invalid
// Useful for routes that work both for authenticated and unauthenticated users
export const optionalAuthenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as TokenPayload;
    req.user = decoded;
  } catch (error) {
    // Continue without setting user
  }

  next();
};
