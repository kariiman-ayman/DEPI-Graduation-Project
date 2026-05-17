import { getCoursesController } from "../../controllers/instructor/course.controller";
import { verifyUser } from "../../middlewares/auth.middleware";
import { Router } from "express";

const router = Router();
router.get("/list", getCoursesController);

export default router;
