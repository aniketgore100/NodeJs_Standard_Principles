import { Router } from "express";
import authRoutes from "../V1/auth.routes.js"
import userRoutes from "../V1/user.routes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);


export default router;