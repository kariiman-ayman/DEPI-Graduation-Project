import { Router } from "express";

import { createCourseController } from "../../controllers/admin/course.controller.js";

import { verifyUser } from "../../middlewares/auth.middleware.js";
import { getCoursesController } from "../../controllers/common/course.controller.js";

const router = Router();

router.post("/", verifyUser, createCourseController);
router.get("/list", verifyUser, getCoursesController);

export default router;
