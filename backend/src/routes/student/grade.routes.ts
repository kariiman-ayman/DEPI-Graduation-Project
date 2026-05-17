import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { getMyGrades } from "../../controllers/student/grade.controller.js";

const router = Router();

router.get("/", verifyUser, getMyGrades);

export default router;
