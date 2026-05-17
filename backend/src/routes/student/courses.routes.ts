import { Router } from "express";

import { verifyUser } from "../../middlewares/auth.middleware.js";
import { getCoursesController } from "../../controllers/common/course.controller.js";
import { getEnrolledCourses } from "../../controllers/student/enrollment.controller.js";

const router = Router();

router.get("/list", verifyUser, getCoursesController);
router.get("/enrolled", verifyUser, getEnrolledCourses);

export default router;
