import { Router } from "express";
import {AuthController} from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const authController = new AuthController();

router.post("/", authController.authorization);
router.post("/registration", authController.registration);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/current", authMiddleware, authController.getCurrentUser);

export default router