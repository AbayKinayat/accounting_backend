import { Router } from "express";
import {AuthController} from "../controllers/auth";

const router = Router();
const authController = new AuthController();

router.post("/authorization", authController.authorization);
router.post("/registration", authController.registration);
router.post("/refresh", authController.refreshToken);

export default router