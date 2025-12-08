import { Router } from "express";
import {
  openLed,
  messageToOled,
  getOledMessage,
  updateOledMessage,
  getTempInOneHour,
  getEventLogs,
  getSystemAlerts,
  updateLedConfig,
} from "../controllers/device.controller.js";

const router = Router();

router.get("/open-led", openLed);
router.get("/message-to-oled", messageToOled);
router.get("/oled/:id", getOledMessage)
router.patch("/oled", updateOledMessage)
router.patch("/led", updateLedConfig)
router.get("/temp/:id/hour", getTempInOneHour);
router.get("/event-log/:id", getEventLogs);
router.get("/system-alert/:id", getSystemAlerts);
router.patch("/oled", updateOledMessage);

export default router;
