import { Router } from "express";
import { getDashboardController } from "../../controllers/admin/dashboard.controller.js";

const router = Router();

router.get("/", getDashboardController);

export default router;
