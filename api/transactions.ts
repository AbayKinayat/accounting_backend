import { Router } from "express";
import { TransactionsController } from "../controllers/transactions";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const transactionController = new TransactionsController();

router.post("/", authMiddleware, transactionController.get);
router.post("/create", authMiddleware, transactionController.create);
router.post("/:id", authMiddleware, transactionController.getById);
router.delete('/:id', authMiddleware, transactionController.remove);
router.put("/:id", authMiddleware, transactionController.edit);

export default router;