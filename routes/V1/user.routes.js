import { Router } from "express";
import { getUserInfo } from "../../controller/user.controller.js";
import catchAsync from "../../utils/catchAsync.js";
import protect from "../../middleware/protect.middleware.js";

const router = Router();

router.get('/v1/:id', protect, catchAsync(getUserInfo));

export default router;
