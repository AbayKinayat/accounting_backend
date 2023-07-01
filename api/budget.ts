import { Router } from "express";
import { BudgetController } from "../controllers/budget";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const budgetController = new BudgetController();

router.put("/", authMiddleware, budgetController.update);

export default router;