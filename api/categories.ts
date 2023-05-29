import { Router } from "express";
import { CategoriesController } from "../controllers/categories";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const categoriesController = new CategoriesController();

router.post("/", authMiddleware, categoriesController.get);

export default router;