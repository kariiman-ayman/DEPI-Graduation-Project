import { Router } from "express";

import { verifyUser } from "@/middlewares/auth.middleware";
import { getCoursesController } from "@/controllers/common/course.controller";
import { getEnrolledCourses } from "@/controllers/student/enrollment.controller";

const router = Router();

router.get("/list", verifyUser, getCoursesController);
router.get("/enrolled", verifyUser, getEnrolledCourses);

export default router;
