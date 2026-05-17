import { Router } from "express";

import { getInstructorsController } from "../../controllers/admin/instructor.controller.js";

const router = Router();

router.get("/list", getInstructorsController);

export default router;
