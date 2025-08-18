import express from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Apply authentication to all dashboard routes
router.use(authenticateJWT);

// Routes
router.get("/data", DashboardController.getDashboardData);
router.get("/budget", DashboardController.getBudgetVsActual);

export default router;
