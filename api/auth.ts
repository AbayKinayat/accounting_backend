import { Router } from "express";
import {AuthController} from "../controllers/auth";

const router = Router();
const authController = new AuthController();

router.post("/", authController.authorization);
router.post("/registration", authController.registration);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

export default router