import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { getMyGrades } from "../../controllers/student/grade.controller";

const router = Router();

router.get("/", verifyUser, getMyGrades);

export default router;
