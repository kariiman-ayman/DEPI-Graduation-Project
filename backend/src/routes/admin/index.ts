import { Router } from "express";
import authRoutes from "./auth.routes";
import inviteRoutes from "./invite.routes";
import courseRoutes from "./course.routes";
import instructorRoutes from "./instructor.routes";
import departmentsRoutes from "./department.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/invite", inviteRoutes);
router.use("/course", courseRoutes);
router.use("/department", departmentsRoutes);
router.use("/instructor", instructorRoutes);

export default router;
