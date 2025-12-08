import { Router } from "express";
import userControllers from "../controllers/user.controllers.js";

const router = Router();

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);
router.get("/managed-bin-id", userControllers.getManagedBinId);

export default router;
