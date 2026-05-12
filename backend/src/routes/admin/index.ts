import { Router } from "express";
import authRoutes from "./auth.routes";
import inviteRoutes from "./invite.routes";
import courseRoutes from "./course.routes";
import instructorRoutes from "./instructor.routes";
import departmentsRoutes from "./department.routes";
import paymentRoutes from "./payment.routes";
import profileRoutes from "./profile.routes";
import studentRoutes from "./student.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/invite", inviteRoutes);
router.use("/course", courseRoutes);
router.use("/department", departmentsRoutes);
router.use("/instructor", instructorRoutes);
router.use("/payments", paymentRoutes);
router.use("/profile", profileRoutes);
router.use("/student", studentRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
