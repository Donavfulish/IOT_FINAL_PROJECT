import { Router } from "express";
import { openLed, messageToOled } from "../controllers/device.controller.js";

const router = Router();

router.get("/open-led", openLed);
router.get("/message-to-oled", messageToOled);

export default router;
