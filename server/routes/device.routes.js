import { Router } from "express";
import deviceControllers from "../controllers/device.controllers.js";

const router = Router();

router.get("/open-led", deviceControllers.openLed);
router.get("/message-to-oled", deviceControllers.messageToOled);
router.get("/oled/:id", deviceControllers.getOledMessage);
router.patch("/oled", deviceControllers.updateOledMessage);
router.patch("/led", deviceControllers.updateLedConfig);
router.get("/temp/:id/hour", deviceControllers.getTempInOneHour);
router.get("/event-log/:id", deviceControllers.getEventLogs);
router.get("/system-alert/:id", deviceControllers.getSystemAlerts);

export default router;
