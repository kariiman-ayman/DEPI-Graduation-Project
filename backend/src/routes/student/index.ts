import { Router } from "express";
import authRoutes from "./auth.routes";
import coursesRoutes from "./courses.routes";
import enrollmentRoutes from "./enrollment.routes";
import lectureRoutes from "./lecture.routes";
import gradeRoutes from "./grade.routes";
import attendanceRoutes from "./attendance.routes";
import paymentRoutes from "./payment.routes";
import profileRoutes from "./profile.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/courses", coursesRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/lectures", lectureRoutes);
router.use("/grades", gradeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/payments", paymentRoutes);
router.use("/profile", profileRoutes);

export default router;
