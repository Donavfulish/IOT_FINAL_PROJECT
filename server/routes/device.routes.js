import { Router } from "express";
import { openLid } from "../controllers/device.controller.js";

const router = Router();

router.get("/open-lid", openLid);

export default router;
