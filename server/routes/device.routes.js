import { Router } from "express";
import { openLed, messageToOled, getOledMessage, updateOledMessage, updateLedConfig } from "../controllers/device.controller.js";

const router = Router();

router.get("/open-led", openLed);
router.get("/message-to-oled", messageToOled);
router.get("/oled/:id", getOledMessage)
router.patch("/oled", updateOledMessage)
router.patch("/led", updateLedConfig)
export default router;
