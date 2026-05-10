import { Router } from "express";

import {
  createCourseController,
  getCoursesController,
} from "@/controllers/admin/course.controller";

import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/", verifyUser, createCourseController);
router.get("/list", verifyUser, getCoursesController);

export default router;
