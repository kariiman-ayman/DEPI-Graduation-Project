import { Router } from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import lectureRoutes from "./lecture.routes.js";
import gradeRoutes from "./grade.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import profileRoutes from "./profile.routes.js";
import { verifyUser } from "../../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lecture", lectureRoutes);
router.use("/course", verifyUser, courseRoutes);
router.use("/grades", gradeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/profile", profileRoutes);

export default router;
