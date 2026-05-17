import { Router } from "express";

import { enroll } from "../../controllers/student/enrollment.controller.js";

import { verifyUser } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyUser, enroll);

export default router;
