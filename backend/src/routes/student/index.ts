import { Router } from "express";
import authRoutes from "./auth.routes";
import coursesRoutes from "./courses.routes";
import enrollmentRoutes from "./enrollment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/courses", coursesRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;
