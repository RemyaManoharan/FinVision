import { Router } from "express";
import userRoutes from "./user.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/users", userRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/assets', assetRoutes);
// router.use('/budgets', budgetRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
