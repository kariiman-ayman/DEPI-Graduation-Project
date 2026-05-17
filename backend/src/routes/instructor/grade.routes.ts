import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import {
  getCourseGrades,
  upsertGrade,
} from "../../controllers/instructor/grade.controller";

const router = Router();

router.get("/", verifyUser, getCourseGrades);
router.post("/", verifyUser, upsertGrade);

export default router;
