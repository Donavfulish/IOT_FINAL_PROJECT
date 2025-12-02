import { Router } from "express";
import { openLed, messageToOled, getOledMessage } from "../controllers/device.controller.js";

const router = Router();

router.get("/open-led", openLed);
router.get("/message-to-oled", messageToOled);
router.get("/oled/:id", getOledMessage)

export default router;
