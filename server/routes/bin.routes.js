import { Router } from "express";
import binControllers from "../controllers/bin.controllers.js";

const router = Router();

router.get("/:id", binControllers.getBinDetailById);
router.get("/", binControllers.getAllBins);

export default router;
