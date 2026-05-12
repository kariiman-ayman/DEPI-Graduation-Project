import { Router } from "express";
import { verifyUser } from "@/middlewares/auth.middleware";
import { getLectures, saveProgress } from "@/controllers/student/lecture.controller";

const router = Router();

router.get("/", verifyUser, getLectures);
router.post("/:lectureId/progress", verifyUser, saveProgress);

export default router;
