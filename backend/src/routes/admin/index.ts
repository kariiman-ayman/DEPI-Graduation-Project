import { Router } from "express";
import authRoutes from "./auth.routes.js";
import inviteRoutes from "./invite.routes.js";
import courseRoutes from "./course.routes.js";
import instructorRoutes from "./instructor.routes.js";
import departmentsRoutes from "./department.routes.js";
import paymentRoutes from "./payment.routes.js";
import profileRoutes from "./profile.routes.js";
import studentRoutes from "./student.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

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
