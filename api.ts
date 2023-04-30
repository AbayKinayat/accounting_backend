import { Router } from "express";
import auth from "./api/auth";
import transactions from "./api/transactions";
import categories from "./api/categories";

const router = Router();

router.use("/auth", auth);
router.use("/transactions", transactions);
router.use("/categories", categories);

export default router;
