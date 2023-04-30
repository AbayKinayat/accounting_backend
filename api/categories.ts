import { Router } from "express";
import { CategoriesController } from "../controllers/categories";

const router = Router();
const categoriesController = new CategoriesController();

router.post("/", categoriesController.get);

export default router;