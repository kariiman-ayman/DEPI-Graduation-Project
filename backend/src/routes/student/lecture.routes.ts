import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import {
  getLectures,
  saveProgress,
} from "../../controllers/student/lecture.controller.js";

const router = Router();

router.get("/", verifyUser, getLectures);
router.post("/:lectureId/progress", verifyUser, saveProgress);

export default router;
