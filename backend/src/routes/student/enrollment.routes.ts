import { Router } from "express";

import { enroll } from "@/controllers/student/enrollment.controller";

import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/", verifyUser, enroll);

export default router;
