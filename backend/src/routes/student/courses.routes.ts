import { Router } from "express";

import { verifyUser } from "@/middlewares/auth.middleware";
import { getCoursesController } from "@/controllers/common/course.controller";

const router = Router();

router.get("/list", verifyUser, getCoursesController);

export default router;
