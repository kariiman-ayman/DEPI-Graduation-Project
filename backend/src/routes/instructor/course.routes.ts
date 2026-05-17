import { getCoursesController } from "../../controllers/instructor/course.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();
router.get("/list", getCoursesController);

export default router;
