import { Router } from "express";
import {
  getStudentsController,
  getStudentDetailsController,
} from "../../controllers/admin/student.controller";

const router = Router();

router.get("/list", getStudentsController);
router.get("/:id", getStudentDetailsController);

export default router;
