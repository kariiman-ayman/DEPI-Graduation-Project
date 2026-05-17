import { Router } from "express";

import { createCourseController } from "../../controllers/admin/course.controller";

import { verifyUser } from "../../middlewares/auth.middleware";
import { getCoursesController } from "../../controllers/common/course.controller";

const router = Router();

router.post("/", verifyUser, createCourseController);
router.get("/list", verifyUser, getCoursesController);

export default router;
