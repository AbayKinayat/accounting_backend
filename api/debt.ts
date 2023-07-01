import { Router } from "express";
import { DebtController } from "../controllers/debt";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const debtController = new DebtController();

router.post("/", authMiddleware, debtController.get);
router.post("/create", authMiddleware, debtController.create);
router.put("/:id", authMiddleware, debtController.update);
router.delete("/:id", authMiddleware, debtController.delete);

export default router;