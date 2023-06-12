import { Router } from "express";
import { AccountController } from "../controllers/account";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const accountController = new AccountController();

router.put("/cash", authMiddleware, accountController.updateCash);

export default router