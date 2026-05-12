import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import lectureRoutes from "./lecture.routes";
import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lecture", lectureRoutes);
router.use("/course", verifyUser, courseRoutes);

export default router;
