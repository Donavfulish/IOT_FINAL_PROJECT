import { Router } from "express";
import firebaseControllers from "../controllers/firebase.controllers.js";

const router = Router();

router.post("/save-fcm-token", firebaseControllers.saveFCMToken);
router.post("/send-notification", firebaseControllers.sendNotification);

export default router;
