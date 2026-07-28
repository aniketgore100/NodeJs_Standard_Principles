import { Router } from "express";
import catchAsync from "../../utils/catchAsync.js";
import {login, refreshAccessToken, register} from "../../controller/user.controller.js"

const router = Router()
router.post("/v1/register", catchAsync(register));
router.post("/v1/login", catchAsync(login))
router.post("/v1/refresh", catchAsync(refreshAccessToken))

export default router
