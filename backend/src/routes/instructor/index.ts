import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import lectureRoutes from "./lecture.routes";
import gradeRoutes from "./grade.routes";
import attendanceRoutes from "./attendance.routes";
import profileRoutes from "./profile.routes";
import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lecture", lectureRoutes);
router.use("/course", verifyUser, courseRoutes);
router.use("/grades", gradeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/profile", profileRoutes);

export default router;
