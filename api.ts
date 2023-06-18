import { Router } from "express";
import auth from "./api/auth";
import transactions from "./api/transactions";
import categories from "./api/categories";
import account from "./api/account";
import debt from "./api/debt";

const router = Router();

router.use("/auth", auth);
router.use("/transactions", transactions);
router.use("/categories", categories);
router.use("/account", account);
router.use("/debt", debt);

export default router;
