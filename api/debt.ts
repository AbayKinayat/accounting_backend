import { Router } from "express";
import { DebtController } from "../controllers/debt";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const debtController = new DebtController();

router.post("/", authMiddleware, debtController.get);
router.post("/create", authMiddleware, debtController.create);
router.put("/", authMiddleware, debtController.update);
router.delete("/", authMiddleware, debtController.delete);

export default router;