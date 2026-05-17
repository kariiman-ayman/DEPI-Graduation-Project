import { Router } from "express";
import authRoutes from "./auth.routes.js";
import coursesRoutes from "./courses.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import lectureRoutes from "./lecture.routes.js";
import gradeRoutes from "./grade.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import paymentRoutes from "./payment.routes.js";
import profileRoutes from "./profile.routes.js";

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
