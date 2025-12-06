import { Router } from "express";
import { getBinDetailById } from "../controllers/bin.controller.js";

const router = Router();

router.get("/:id", getBinDetailById);

export default router;
