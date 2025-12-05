import { Router } from "express";
import {
  openLed,
  messageToOled,
  getOledMessage,
  updateOledMessage,
  getTempInOneHour,
} from "../controllers/device.controller.js";

const router = Router();

router.get("/open-led", openLed);
router.get("/message-to-oled", messageToOled);
router.get("/oled/:id", getOledMessage);
router.get("/temp/:id/hour", getTempInOneHour);
router.patch("/oled", updateOledMessage);

export default router;
