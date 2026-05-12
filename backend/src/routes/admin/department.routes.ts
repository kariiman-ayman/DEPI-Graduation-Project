import { Router } from "express";

import {
  createDepartmentController,
  getDepartmentsController,
  deleteDepartmentController,
} from "@/controllers/admin/department.controller";

import { verifyUser } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/", verifyUser, createDepartmentController);
router.get("/list", verifyUser, getDepartmentsController);
router.delete("/:id", verifyUser, deleteDepartmentController);

export default router;
