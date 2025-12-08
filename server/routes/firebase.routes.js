import { Router } from "express";
import {
  saveFCMToken,
  sendNotification,
} from "../controllers/firebase.controller.js";

const router = Router();

router.post("/save-fcm-token", saveFCMToken);
router.post("/send-notification", sendNotification);

export default router;
